let logic = require ("../..")

let job = new logic.db_t
let salary = new logic.db_t
let address = new logic.db_t
let supervisor = new logic.db_t


job.i ({
    name: "Bitdiddle Ben",
    dept: "computer",
    role: "wizard",
})

salary.i ({
    name: "Bitdiddle Ben",
    amount: 40000,
})

address.i ({
    name: "Bitdiddle Ben",
    town: "Slunerville",
    road: "Ridge Road",
    door: 10,
})

supervisor.i ({
    slave: "Bitdiddle Ben",
    master: "Warbucks Oliver",
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


// query

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


let computer_dept_slave = new logic.db_t

computer_dept_slave.i ({
    slave: "?slave",
}) .cond ((data, prop) => {
    let z = new logic.var_t
    prop.and (job.o ({ name: data.slave, dept: "computer" }))
        .and (supervisor.o ({ slave: data.slave, master: z }))
})

console.log (
    computer_dept_slave.q (10) ({
        slave: "?slave",
    })
)
