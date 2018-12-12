let { rule_t, var_t } = require ("logic-io")

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

let bigshot = new rule_t

bigshot.i ({
    name: "?name",
    dept: "?dept",
}) .if (() => {
    let master = new var_t ("master")
    return job.o ({ name: this.name, dept: this.dept })
        .and (supervisor.not ({ slave: this.name, master }))
        .and (job.not ({ name: master, dept: this.dept }))
})

console.log (job)
console.log (bigshot)

let searching = address.search ({
    name: "Bitdiddle Ben",
    addr: new var_t ("addr"),
})

console.log (searching.next_subst ())
console.log (searching.next_subst ())
