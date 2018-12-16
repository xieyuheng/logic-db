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

    unify (x, y) {
        x = this.walk (x)
        y = this.walk (y)
        if ((x instanceof var_t) &&
            (y instanceof var_t) &&
            (x === y)) {
            return this
        } else if (x instanceof var_t) {
            return this.extend (x, y)
        } else if (y instanceof var_t) {
            return this.extend (y, x)
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

    // localize_by_data (x) {}

    // reify (x) {
    //     x = this.deep_walk (x)
    //     let new_subst = new subst_t
    //     let local_subst = new_subst.localize_by_data (x)
    //     return local_subst.deep_walk (x)
    // }

    reify (x) {
        return this.deep_walk (x)
    }
}

class fact_t {
    constructor (term) {
        this.term = term
        this.cond = null;
    }
}

function term_to_data (term) {
    return term_to_data_with_var_map (term, new Map)
}

function term_to_data_with_var_map (term, var_map) {
    if (term instanceof Array) {
        let array = []
        for (let x of term) {
            array.push (term_to_data_with_var_map (x, var_map))
        }
        return array
    } else if (obj_p (term)) {
        let obj = {}
        for (let k in term) {
            obj [k] = term_to_data_with_var_map (term [k], var_map)
        }
        return obj
    } else if ((typeof term === "string") &&
               (term.startsWith ("?"))) {
        let name = term.slice (1)
        let v = var_map.get (name)
        if (v === undefined) {
            v = new var_t (name)
            var_map.set (name, v)
        }
        return v
    } else {
        return term
    }
}

export class db_t {
    constructor () {
        // : array_t (fact_t)
        this.fact_array = []
    }

    // -- term_t
    // -> [effect]
    i (term) {
        this.fact_array.push (new fact_t (term))
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
        return new prop_t (this, data, [])
    }

    // -- data_t
    // -> searching_t
    search (data) {
        return new searching_t ([
            new deduction_t (new subst_t, [this.o (data)])
        ])
    }

    // -- numebr_t
    // -> -- term_t -> array_t (subst_t)
    q (n) {
        return (term) => {
            let var_map = new Map
            let data = term_to_data_with_var_map (term, var_map)
            let searching = this.search (data)
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
}

class query_res_t {
    constructor () {
        this.solutions = []
    }
}

class searching_t {
    constructor (deduction_queue) {
        this.deduction_queue = deduction_queue
    }

    next_subst () {
        while (this.deduction_queue.length !== 0) {
            let deduction = this.deduction_queue.shift ()
            let res = deduction.step ()
            if (res.tag === "qed") {
                return res.subst
            } else if (res.tag === "more") {
                for (let deduction of res.deduction_queue) {
                    //// about searching
                    // push front |   depth first
                    // push back  | breadth first
                    this.deduction_queue.push (deduction)
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

class deduction_t {
    constructor (subst, prop_queue) {
        this.subst = subst
        this.prop_queue = prop_queue
    }

    step () {
        if (this.prop_queue.length !== 0) {
            let prop = this.prop_queue.shift ()
            let prop_matrix = prop.apply (this.subst)
            let deduction_queue = []
            for (let [ prop_array, subst ] of prop_matrix) {
                deduction_queue.push (
                    new deduction_t (
                        subst,
                        //// about searching again
                        // push front |   depth first
                        // push back  | breadth first
                        this.prop_queue.concat (prop_array)))
            }
            return {
                tag: "more",
                deduction_queue,
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
    constructor (db, data, prop_array) {
        this.db = db
        this.data = data
        this.prop_array = prop_array
    }

    // -- subst_t
    // -> array_t ([array_t (prop_t), subst_t])
    apply (subst) {
        let matrix = []
        for (let fact of this.db.fact_array) {
            if (typeof fact.cond === "function") {
                let data = term_to_data (fact.term)
                let new_subst = subst.unify (data, this.data)
                if (new_subst !== null) {
                    let prop = new prop_t (
                        this.db, this.data, [])
                    fact.cond (data, prop)
                    matrix.push ([
                        this.prop_array.concat (prop.prop_array),
                        new_subst,
                    ])
                }
            } else {
                let data = term_to_data (fact.term)
                let new_subst = subst.unify (data, this.data)
                if (new_subst !== null) {
                    matrix.push ([
                        this.prop_array,
                        new_subst,
                    ])
                }
            }
        }
        return matrix
    }

    // -- prop_t
    // -> prop_t
    and (prop) {
        this.prop_array.push (prop)
        return this
    }
}

export class var_t {
    constructor (name) {
        this.uuid = var_t.var_counter++
        if (name !== undefined) {
            this.name = name
        }
    }
}

var_t.var_counter = 0
