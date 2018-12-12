"use strict"

export class rule_t {
    constructor () {
        // : array_t (arguments_t)
        this.disj_list = []
    }

    // -- any ...
    // -> [effect]
    i () {
        this.disj_list.push (arguments)
    }

    // -- var_t ...
    // -> relation_t
    o () {
        return new relation_t (this, arguments)
    }

    // -- any ...
    // -> searching_t
    search () {
        return new searching_t ([
            new deduction_t (
                new Map,
                [this.o (...arguments)])
        ])
    }
}

class deduction_t {
    constructor (subst, relation_queue) {
        this.subst = subst
        this.relation_queue = relation_queue
    }

    step () {

    }
}

class searching_t {
    constructor (deduction_queue) {
        this.deduction_queue = deduction_queue
    }

    next_subst () {
        while (this.deduction_queue.length !== 0) {
            let deduction = this.deduction_queue.pop ()
            let step_result = deduction.step ()
            if (step_result.tag === "qed") {
                return step_result.qed
            } else if (step_result.tag === "more") {
                for (let deduction
                     of step_result.deduction_queue) {
                    //// about searching
                    // push front |   depth first
                    // push back  | breadth first
                    self.deduction_queue.push (deduction)
                }
            } else if (step_result.tag === "fail") {
                // pass
            } else {
                console.log (
                    "searching_t", "next_subst",
                    "unknown step_result:", step_result)
            }
        }
        return null
    }
}

class relation_t {
    constructor (rule, args) {
        this.rule = rule
        this.args = args
    }

    // -- relation_t
    // -> relation_t
    n () {

    }

    // -- relation_t
    // -> relation_t
    and () {

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

job.i ("Bitdiddle Ben", "computer wizard")
salary.i ("Bitdiddle Ben", 40000)
supervisor.i ("Bitdiddle Ben",
              "Warbucks Oliver")
address.i ("Bitdiddle Ben",
           "Slunerville Ridge Road 10")

address.i ("Hacker Alyssa P",
           "Cambridge Mass Ave 78")

let bigshot = new rule_t

bigshot.i ((x, dept) => {
    let z = new var_t
    return job.o (x, dept)
        .n (supervisor.o (x, z))
        .n (job.o (z, dept))
})

console.log (job)
console.log (bigshot)
