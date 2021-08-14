let logic = require ("logic-db")

let a = new logic.db_t

a.i (["g", "h"])
a.i (["d", "a"])
a.i (["g", "d"])
a.i (["e", "d"])
a.i (["h", "f"])
a.i (["e", "f"])
a.i (["a", "e"])
a.i (["a", "b"])
a.i (["b", "f"])
a.i (["b", "c"])
a.i (["f", "c"])

// a e d -- in a loop

// we need to avoid searching in a loop

// prepare the lispy list

function cons (x, y) { return { car: x, cdr: y } }

let path = new logic.db_t

path.i (["?x", "?x", "?occurs"])
path.i (["?x", "?y", "?occurs"]) .cond ((the) => {
    let z = new logic.var_t
    return a.o ([the.var.x, z])
        .and (legal.o ([z, the.var.occurs]))
        .and (path.o ([z, the.var.y, cons (z, the.var.occurs)]))
})

let legal = new logic.db_t

legal.i (["?z", null])
legal.i (["?z", cons ("?car", "?cdr")]) .cond ((the) => {
    return legal.o ([the.var.z, the.var.cdr])
        .not_eqv (the.var.z, the.var.car)
})

path.query_log (100) (["f", "f", null])
path.query_log (100) (["a", "c", null])
path.query_log (100) (["g", "e", null])

path.query_log (100) (["g", "?x", null])
path.query_log (100) (["?x", "h", null])

path.query_log (100) (["g", "c", null])
path.query_log (100) (["g", "c", cons ("f", null)])

path.query_log (100) (["a", "?x", cons ("f", cons ("d", null))])
path.query_log (100) (["a", "?x", null])
