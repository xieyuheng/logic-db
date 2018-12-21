---
tangle: a-boston-high-tech-company.js
---

# A Boston high tech company

In order to illustrate what the query system does,
we will show how it can be used to manage the database of personnel records
for a thriving high-technology company in the Boston area.

The language provides pattern-directed access to personnel information and can also take advantage of general rules in order to make logical deductions.

## A sample database

The personnel database contains assertions
about company personnel.

We first import `logic-db`, and prepare the databases.

``` js
let logic = require ("logic-db")

let job = new logic.db_t
let salary = new logic.db_t
let address = new logic.db_t
let supervisor = new logic.db_t
```

Here is the information about Ben Bitdiddle,
the resident computer wizard:

``` js
job.i ({
    name: "Bitdiddle Ben",
    dept: "computer",
    role: "wizard",
})

salary.i ({
    name: "Bitdiddle Ben",
    amount: 60000,
})

address.i ({
    name: "Bitdiddle Ben",
    town: "Slumerville",
    road: "Ridge Road",
    door: 10,
})
```

As resident wizard,
Ben is in charge of the company’s computer division,
and he supervises two programmers and one technician.

Here is the information about them:

``` js
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
    amount: 40000,
})

supervisor.i ({
    slave: "Hacker Alyssa P",
    master: "Bitdiddle Ben",
})


address.i ({
    name: "Fect Cy D",
    town: "Cambridge",
    road: "Ames Street",
    door: 3,
})

job.i ({
    name: "Fect Cy D",
    dept: "computer",
    role: "programmer",
})

salary.i ({
    name: "Fect Cy D",
    amount: 35000,
})

supervisor.i ({
    slave: "Fect Cy D",
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
    amount: 25000,
})

supervisor.i ({
    slave: "Tweakit Lem E",
    master: "Bitdiddle Ben",
})
```

There is also a programmer trainee,
who is supervised by Alyssa:

``` js
address.i ({
    name: "Reasoner Louis",
    town: "Slumerville",
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
    amount: 30000,
})

supervisor.i ({
    slave: "Reasoner Louis",
    master: "Hacker Alyssa P",
})
```

Ben is a high-level employee.
His supervisor is the company’s big wheel himself:

``` js
supervisor.i ({
    slave: "Bitdiddle Ben",
    master: "Warbucks Oliver",
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
    amount: 150000,
})
```

Besides the computer division supervised by Ben,
the company has an accounting division,
consisting of a chief accountant and his assistant:

``` js
address.i ({
    name: "Scrooge Eben",
    town: "Weston",
    road: "Shady Lane",
    door: 10,
})

job.i ({
    name: "Scrooge Eben",
    dept: "accounting",
    role: "chief accountant",
})

salary.i ({
    name: "Scrooge Eben",
    amount: 75000,
})

supervisor.i ({
    slave: "Scrooge Eben",
    master: "Warbucks Oliver",
})


address.i ({
    name: "Cratchet Robert",
    town: "Allston",
    road: "N Harvard Street",
    door: 16,
})

job.i ({
    name: "Cratchet Robert",
    dept: "accounting",
    role: "scrivener",
})

salary.i ({
    name: "Cratchet Robert",
    amount: 18000,
})

supervisor.i ({
    slave: "Cratchet Robert",
    master: "Scrooge Eben",
})
```

There is also a secretary for the big wheel:

``` js
address.i ({
    name: "Aull DeWitt",
    town: "Slumerville",
    road: "Onion Square",
    door: 5,
})

job.i ({
    name: "Aull DeWitt",
    dept: "administration",
    role: "secretary",
})

salary.i ({
    name: "Aull DeWitt",
    amount: 25000,
})

supervisor.i ({
    slave: "Aull DeWitt",
    master: "Warbucks Oliver",
})
```

The database also contains assertions about
which kinds of jobs can be done
by people holding other kinds of jobs.

For instance, a computer wizard can do
the jobs of both a computer programmer
and a computer technician:

``` js
let can_do_job = new logic.db_t

can_do_job.i ({
    can: {
        dept: "computer",
        role: "wizard",
    },
    job: {
        dept: "computer",
        role: "programmer",
    },
})

can_do_job.i ({
    can: {
        dept: "computer",
        role: "wizard",
    },
    job: {
        dept: "computer",
        role: "technician",
    },
})
```

A computer programmer could fill in for a trainee:

``` js
can_do_job.i ({
    can: {
        dept: "computer",
        role: "programmer",
    },
    job: {
        dept: "computer",
        role: "programmer trainee",
    },
})
```

Also, as is well known,

``` js
can_do_job.i ({
    can: {
        dept: "administration",
        role: "secretary",
    },
    job: {
        dept: "administration",
        role: "big wheel",
    },
})
```

## Simple queries

The query language allows users
to retrieve information from the database.
For example, to find all computer programmers one can say

``` js
job.query_log (10) ({
    name: "?coder",
    dept: "computer",
    role: "programmer",
})
```

The system will respond with the following solutions:

``` js
{
    solutions: [
        { coder: "Hacker Alyssa P" },
        { coder: "Fect Cy D" },
    ]
}
```

The input query specifies that
we are looking for entries in the database
that match a certain pattern.

`"?coder"` is a pattern variable,

The general form of a pattern variable is a string,
taken to be the name of the variable,
preceded by a question mark.

The system responds to a simple query
by showing all entries in the data base
that match the specified pattern.

A pattern can have more than one variable.

``` js
// employees' addresses
address.query_log (100) ({
    name: "?name",
    town: "?town",
    road: "?road",
    door: "?door",
})

// employees at computer dept
job.query_log (100) ({
    name: "?name",
    dept: "computer",
})
```

We can use `.assert` to assert
there is at least one solution of the query,
or use `.assert_not` to assert there is no solution.

``` js
job.assert ({
    name: "Hacker Alyssa P",
    role: "programmer",
})

supervisor.assert_not ({
    slave: "?x",
    master: "?x",
})
```
## Compound queries

We create new `logic.db_t` to specify compound queries.

`.and`

``` js
let computer_dept_slave = new logic.db_t

computer_dept_slave.i ({
    slave: "?slave",
}) .cond ((the) => {
    let z = new logic.var_t
    return job.o ({ name: the.var.slave, dept: "computer" })
        .and (supervisor.o ({ slave: the.var.slave, master: z }))
})

computer_dept_slave.query_log (10) ({
    slave: "?slave",
})
```

`.not`

``` js
let bigshot = new logic.db_t

bigshot.i ({
    name: "?name",
    dept: "?dept",
}) .cond ((the) => {
    let z = new logic.var_t
    return job.o ({ name: the.var.name, dept: the.var.dept })
        .not (supervisor.o ({ slave: the.var.name, master: z })
              .and (job.o ({ name: z, dept: the.var.dept })))
})

bigshot.query_log (100) ({
    name: "?name",
    dept: "?dept",
})
```

`.pred`

``` js
let not_so_poor = new logic.db_t

not_so_poor.i ({
    name: "?name",
    amount: "?amount",
}) .cond ((the) => {
    return salary.o ({ name: the.var.name, amount: the.var.amount })
        .pred ((subst) => subst.get (the.var.amount) >= 40000)
})

not_so_poor.query_log (10) ({
    name: "?name",
    amount: "?amount",
})
```
