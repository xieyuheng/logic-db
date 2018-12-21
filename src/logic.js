"use strict"

function obj_keys (obj) {
    let keys = []
    for (let k in obj) {
        keys.push (k)
    }
    return keys
}

function obj_length (obj) {
    let n = 0
    for (let _ in obj) {
        n++
    }
    return n
}

function obj_p (x) {
    return (!(typeof x === "string") &&
            !(x instanceof Array) &&
            (obj_length (x) > 0))
}

class subst_t {
    constructor () {
        this.map = new Map;
    }

    extend (v, x) {
        let subst = new subst_t;
        subst.map = new Map (this.map)
        subst.map.set (v, x)
        return subst
    }

    find (v) {
        return this.map.get (v)
    }

    walk (x) {
        while (x instanceof var_t) {
            let y = this.find (x)
            if (y === undefined) {
                return x
            } else {
                x = y
            }
        }
        return x
    }

    var_occur_p (v, x) {
        x = this.walk (x)
        if (x instanceof var_t) {
            return x === v
        } else if (x instanceof Array) {
            for (let e of x) {
                if (this.var_occur_p (v, e)) {
                    return true
                }
            }
            return false
        } else if (obj_p (x)) {
            for (let k in x) {
                if (this.var_occur_p (v, x [k])) {
                    return true
                }
            }
            return false
        } else {
            return false
        }
    }

    unify (x, y) {
        x = this.walk (x)
        y = this.walk (y)
        if ((x instanceof var_t) &&
            (y instanceof var_t) &&
            (x === y)) {
            return this
        } else if (x instanceof var_t) {
            if (this.var_occur_p (x, y)) {
                return null
            } else {
                return this.extend (x, y)
            }
        } else if (y instanceof var_t) {
            if (this.var_occur_p (y, x)) {
                return null
            } else {
                return this.extend (y, x)
            }
        } else if ((x instanceof Array) &&
                   (y instanceof Array)) {
            return this.unify_array (x, y)
        } else if (obj_p (x) &&
                   obj_p (y)) {
            return this.unify_obj (x, y)
        } else if (x === y) {
            return this
        } else {
            return null
        }
    }

    unify_obj (x, y) {
        let x_length = obj_length (x)
        let y_length = obj_length (y)
        if (x_length >= y_length) {
            return this.cover_obj (x, y)
        } else {
            return this.cover_obj (y, x)
        }
    }

    cover_obj (x, y) {
        let subst = this
        for (let k in y) {
            if (x [k] === undefined) {
                return null
            }
            subst = subst.unify (x [k], y [k])
            if (subst === null) {
                return null
            }
        }
        return subst
    }

    unify_array (xs, ys) {
        let subst = this
        if (xs.length !== ys.length) {
            return null
        }
        let length = xs.length
        let i = 0
        while (i < length) {
            subst = subst.unify (xs [i], ys [i])
            if (subst === null) {
                return null
            }
            i++
        }
        return subst
    }

    deep_walk (x) {
        x = this.walk (x)
        if (x instanceof var_t) {
            return x
        } else if (x instanceof Array) {
            let y = []
            for (let e of x) {
                y.push (this.deep_walk (e))
            }
            return y
        } else if (obj_p (x)) {
            let y = {}
            for (let k in x) {
                y [k] = this.deep_walk (x [k])
            }
            return y
        } else {
            return x
        }
    }

    reify (x) {
        return this.deep_walk (x)
    }

    get (x) {
        return this.deep_walk (x)
    }
}

class fact_t {
    constructor (pattern) {
        this.pattern = pattern
        this.cond = null;
    }
}

function pattern_to_data (pattern) {
    return pattern_to_data_with_var_map (pattern, new Map)
}

function pattern_to_data_with_var_map (pattern, var_map) {
    if (pattern instanceof Array) {
        let array = []
        for (let x of pattern) {
            array.push (pattern_to_data_with_var_map (x, var_map))
        }
        return array
    } else if (obj_p (pattern)) {
        let obj = {}
        for (let k in pattern) {
            obj [k] = pattern_to_data_with_var_map (pattern [k], var_map)
        }
        return obj
    } else if ((typeof pattern === "string") &&
               (pattern.startsWith ("?"))) {
        let name = pattern.slice (1)
        let v = var_map.get (name)
        if (v === undefined) {
            v = new var_t (name)
            var_map.set (name, v)
        }
        return v
    } else {
        return pattern
    }
}

class db_t {
    constructor () {
        // : array_t (fact_t)
        this.fact_array = []
    }

    // -- pattern_t
    // -> [effect]
    i (pattern) {
        this.fact_array.push (new fact_t (pattern))
        return this
    }

    // -- -> [effect]
    cond (fun) {
        let fact = this.fact_array.pop ()
        if (fact !== undefined) {
            fact.cond = fun
            this.fact_array.push (fact)
        }
        return this
    }

    // -- data_t
    // -> prop_t
    o (data) {
        return new unit_prop_t (this, data)
    }

    // -- numebr_t
    // -> -- pattern_t -> array_t (subst_t)
    query (n) {
        return (pattern) => {
            let var_map = new Map
            let data = pattern_to_data_with_var_map (pattern, var_map)
            let searching = new searching_t ([
                new prop_row_t (new subst_t, [this.o (data)])
            ])
            let solutions = searching
                .take_subst (n)
                .map ((subst) => {
                    let sol = {}
                    for (let name of var_map.keys ()) {
                        sol [name] = subst.reify (
                            var_map.get (name))
                    }
                    return sol
                })
            let query_res = new query_res_t
            query_res.solutions = solutions
            return query_res
        }
    }

    // -- numebr_t
    // -> -- pattern_t -> array_t (subst_t)
    query_log (n) {
        return (pattern) => {
            let query_res = this.query (n) (pattern)
            query_res.log ()
            return query_res
        }
    }

    assert (pattern) {
        let query_res = this.query (1) (pattern)
        if (query_res.solutions.length === 0) {
            console.log (`- db.assert fail`)
            console.log (`  pattern = ${pattern}`)
            console.log (`  db = ${this}`)
        }
    }

    assert_not (pattern) {
        let query_res = this.query (1) (pattern)
        if (query_res.solutions.length !== 0) {
            console.log (`- db.assert_not fail`)
            console.log (`  pattern = ${pattern}`)
            console.log (`  db = ${this}`)
        }
    }
}

class query_res_t {
    constructor () {
        this.solutions = []
    }

    log () {
        console.log (this)
    }
}

class searching_t {
    constructor (prop_matrix) {
        this.prop_matrix = prop_matrix
    }

    next_subst () {
        while (this.prop_matrix.length !== 0) {
            let prop_row = this.prop_matrix.shift ()
            let res = prop_row.step ()
            if (res.tag === "qed") {
                return res.subst
            } else if (res.tag === "more") {
                for (let prop_row of res.prop_matrix) {
                    //// about searching
                    // push front |   depth first
                    // push back  | breadth first
                    this.prop_matrix.push (prop_row)
                }
            } else {
                console.log (
                    "searching_t", "next_subst",
                    "unknown res:", res)
            }
        }
        return null
    }

    take_subst (n) {
        let array = []
        while (n > 0) {
            let subst = this.next_subst ()
            if (subst === null) {
                break
            } else {
                array.push (subst)
            }
            n--
        }
        return array
    }
}

class prop_row_t {
    constructor (subst, prop_queue) {
        this.subst = subst
        this.prop_queue = prop_queue
    }

    step () {
        if (this.prop_queue.length !== 0) {
            let prop = this.prop_queue.shift ()
            let delta_matrix = prop.eval (this.subst)
            let prop_matrix = []
            for (let prop_row of delta_matrix) {
                prop_matrix.push (
                    new prop_row_t (
                        prop_row.subst,
                        //// about searching again
                        // push front |   depth first
                        // push back  | breadth first
                        this.prop_queue.concat (
                            prop_row.prop_queue)))
            }
            return {
                tag: "more",
                prop_matrix,
            }
        } else {
            return {
                tag: "qed",
                subst: this.subst,
            }
        }
    }
}

class prop_t {
    constructor () {}

    and (that) {
        return new and_prop_t (this, that)
    }

    not (prop) {
        let that = new not_prop_t (prop)
        return new and_prop_t (this, that)
    }

    eqv (v, data) {
        let that = new eqv_prop_t (v, data)
        return new and_prop_t (this, that)
    }

    eqv_with (v, fun) {
        let that = new eqv_with_prop_t (v, fun)
        return new and_prop_t (this, that)
    }

    not_eqv (v, data) {
        let that = new not_eqv_prop_t (v, data)
        return new and_prop_t (this, that)
    }

    pred (pred) {
        let that = new pred_prop_t (pred)
        return new and_prop_t (this, that)
    }
}

function var_map_to_var_obj (var_map) {
    let var_obj = {}
    for (let k of var_map.keys ()) {
        var_obj [k] = var_map.get (k)
    }
    return var_obj
}

class unit_prop_t extends prop_t {
    constructor (db, data) {
        super ()
        this.db = db
        this.data = data
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        let matrix = []
        for (let fact of this.db.fact_array) {
            let var_map = new Map
            let data = pattern_to_data_with_var_map (
                fact.pattern, var_map)
            let new_subst = subst.unify (data, this.data)
            let ctx = new ctx_t (
                new_subst, data,
                var_map_to_var_obj (var_map))
            if (new_subst !== null) {
                if (typeof fact.cond === "function") {
                    let prop = fact.cond (ctx)
                    matrix.push (
                        new prop_row_t (new_subst, [prop]))
                } else {
                    matrix.push (
                        new prop_row_t (new_subst, []))
                }
            }
        }
        return matrix
    }
}

class and_prop_t extends prop_t {
    constructor (lhs, rhs) {
        super ()
        this.lhs = lhs
        this.rhs = rhs
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        let matrix = this.lhs.eval (subst)
        for (let prop_row of matrix) {
            prop_row.prop_queue.push (this.rhs)
        }
        return matrix
    }
}

class not_prop_t extends prop_t {
    constructor (prop) {
        super ()
        this.prop = prop
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        let searching = new searching_t ([
            new prop_row_t (subst, [this.prop])
        ])
        let next_subst = searching.next_subst ()
        if (next_subst === null) {
            return [new prop_row_t (subst, [])]
        } else {
            return []
        }
    }
}

class eqv_prop_t extends prop_t {
    constructor (v, data) {
        super ()
        this.v = v
        this.data = data
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        let new_subst = subst.unify (this.v, this.data)
        if (new_subst !== null) {
            return [new prop_row_t (new_subst, [])]
        } else {
            return []
        }
    }
}

class eqv_with_prop_t extends prop_t {
    constructor (v, fun) {
        super ()
        this.v = v
        this.fun = fun
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        let data = this.fun (subst)
        let new_subst = subst.unify (this.v, data)
        if (new_subst !== null) {
            return [new prop_row_t (new_subst, [])]
        } else {
            return []
        }
    }
}

class not_eqv_prop_t extends prop_t {
    constructor (v, data) {
        super ()
        this.v = v
        this.data = data
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        let new_subst = subst.unify (this.v, this.data)
        if (new_subst !== null) {
            return []
        } else {
            return [new prop_row_t (subst, [])]
        }
    }
}

class pred_prop_t extends prop_t {
    constructor (pred) {
        super ()
        this.pred = pred
    }

    // -- subst_t
    // -> array_t (prop_row_t)
    eval (subst) {
        if (this.pred (subst)) {
            return [new prop_row_t (subst, [])]
        } else {
            return []
        }
    }
}

class var_t {
    constructor (name) {
        this.uuid = var_t.var_counter++
        if (name !== undefined) {
            this.name = name
        }
    }
}

var_t.var_counter = 0

class ctx_t {
    constructor (subst, data, var_obj) {
        this.subst = subst
        this.data = data
        this.var = var_obj
    }
}

export default { db_t, var_t }
