let { rule_t, var_t } = require ("logic-io")

let job = new rule_t
let salary = new rule_t
let supervisor = new rule_t
let address = new rule_t


job.i ({
    name: "Bitdiddle Ben",
    dept: "computer",
    role: "wizard",
})

salary.i ({
    name: "Bitdiddle Ben",
    amount: 40000,
})

supervisor.i ({
    slave: "Bitdiddle Ben",
    master: "Warbucks Oliver",
})

address.i ({
    name: "Bitdiddle Ben",
    town: "Slunerville",
    road: "Ridge Road",
    door: 10,
})


address.i ({
    name: "Hacker Alyssa P",
    town: "Cambridge",
    road: "Mass Ave",
    door: 78,
})

job.i ({
    name: "Hacker Alyssa P",
    dept: "computer",
    role: "programmer",
})

salary.i ({
    name: "Hacker Alyssa P",
    amount: 35000,
})

supervisor.i ({
    slave: "Hacker Alyssa P",
    master: "Bitdiddle Ben",
})


address.i ({
    name: "Tweakit Lem E",
    town: "Boston",
    road: "Bay State Road",
    door: 22,
})

job.i ({
    name: "Tweakit Lem E",
    dept: "computer",
    role: "technician",
})

salary.i ({
    name: "Tweakit Lem E",
    amount: 15000,
})

supervisor.i ({
    slave: "Tweakit Lem E",
    master: "Bitdiddle Ben",
})


address.i ({
    name: "Reasoner Louis",
    town: "Slunerville",
    road: "Pine Tree Road",
    door: 80,
})

job.i ({
    name: "Reasoner Louis",
    dept: "computer",
    role: "programmer trainee",
})

salary.i ({
    name: "Reasoner Louis",
    amount: 20000,
})

supervisor.i ({
    slave: "Reasoner Louis",
    master: "Hacker Alyssa P",
})


address.i ({
    name: "Warbucks Oliver",
    town: "Swellesley",
    road: "The Manor",
})

job.i ({
    name: "Warbucks Oliver",
    dept: "administration",
    role: "big wheel",
})

salary.i ({
    name: "Warbucks Oliver",
    amount: 100000,
})


// let bigshot = new rule_t

// bigshot.i ({
//     name: "?name",
//     dept: "?dept",
// }) .if (() => {
//     let master = new var_t ("master")
//     return job.o ({ name: this.name, dept: this.dept })
//         .and (supervisor.not ({ slave: this.name, master }))
//         .and (job.not ({ name: master, dept: this.dept }))
// })

console.log (
    address.q (1) ({
        name: "Bitdiddle Ben",
        road: "?road",
        door: "?door",
    })
)

console.log (
    job.q (10) ({
        name: "?name",
        dept: "computer",
        role: "?role",
    })
)
