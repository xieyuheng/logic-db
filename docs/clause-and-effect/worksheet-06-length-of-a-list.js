let logic = require ("logic-db")

// prepare the lispy list

function cons (x, y) { return { car: x, cdr: y } }

// prepare the nat
//   for we can not deal with native js number logically yet ...
//   I am sorry about this, and I will fix this soon

let zero = "zero"
function succ (n) { return { prev: n } }

let list_length = new logic.db_t

list_length.i ({
    list: null,
    length: zero,
})

list_length.i ({
    list: { car: "?car", cdr: "?cdr" },
    length: "?length",
}) .cond ((the) => {
    let cdr_length = new logic.var_t
    return list_length.o ({
        list: the.var.cdr,
        length: cdr_length,
    }) .eqv (the.var.length, succ (cdr_length))
})

list_length.query_log (1) ({
    list: cons ("apple", cons ("pear", null)),
    length: "?length",
})

list_length.query_log (10) ({
    list: "?list",
    length: succ (succ (zero)),
})
