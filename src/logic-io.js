"use strict"

class subst_t {
    constructor () {
        this.map = new Map;
    }

    extend (v, x) {
        let map = new Map (this.map)
        map.set (v, x)
        return map
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
        } else if (x === y) {
            return this
        } else {
            return null
        }
    }

    // unify_obj (xs, ys)

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
}

class conj_t {
    constructor (arg) {
        this.arg = arg
        this.if = null;
    }
}

export class rule_t {
    constructor () {
        // : array_t (conj_t)
        this.conj_array = []
    }

    // -- data_t
    // -> [effect]
    i (data) {
        this.conj_array.push (new conj_t (data))
        return this
    }

    // -- -> [effect]
    if (fun) {
        let conj = this.conj_array.pop ()
        if (conj !== undefined) {
            conj.if = fun
            this.conj_array.push (conj)
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
    constructor (rule, arg, prop_array) {
        this.rule = rule
        this.arg = arg
        this.prop_array = prop_array
    }

    // -- subst_t
    // -> array_t ([array_t (prop_t), subst_t])
    apply (subst) {
        let matrix = []
        for (let conj of this.rule.conj_array) {
            if (typeof conj.if === 'function') {
                // need a dup of conj.arg to get fresh var_t
                let new_subst = subst.unify (conj.arg, this.arg)
                if (new_subst !== null) {
                    let new_prop = conj.if.bind (conj.arg) ()
                    matrix.push ([
                        this.prop_array.concat ([new_prop]),
                        new_subst,
                    ])
                }
            } else {
                let new_subst = subst.unify (conj.arg, this.arg)
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
        let new_prop = new prop_t (this)
        new_prop.prop_array.push (prop)
        return new_prop
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

let job = new rule_t
let salary = new rule_t
let supervisor = new rule_t
let address = new rule_t

job.i ({
    name: "Bitdiddle Ben",
    dept: "computer wizard",
})
salary.i ({
    name: "Bitdiddle Ben",
    num: 40000,
})
supervisor.i ({
    slave: "Bitdiddle Ben",
    master: "Warbucks Oliver",
})
address.i ({
    name: "Bitdiddle Ben",
    addr: "Slunerville Ridge Road 10",
})
address.i ({
    name: "Hacker Alyssa P",
    addr: "Cambridge Mass Ave 78",
})
address.i ({ name: "Xie", addr: "#1 street" })
address.i ({ name: "Xie", addr: "#2 street" })
address.i ({ name: "Xie", addr: "#3 street" })

let bigshot = new rule_t

bigshot.i ({
    name: "?name",
    dept: "?dept",
}) .if (() => {
    let master = new var_t ("?master")
    return job.o ({ name: this.name, dept: this.dept })
        .and (supervisor.not ({ slave: this.name, master }))
        .and (job.not ({ name: master, dept: this.dept }))
})


console.log (job)
console.log (bigshot)

let searching = address.search ([
    "Xie", new var_t ("address")
])

console.log (searching.next_subst ())
console.log (searching.next_subst ())
console.log (searching.next_subst ())
console.log (searching.next_subst ())
