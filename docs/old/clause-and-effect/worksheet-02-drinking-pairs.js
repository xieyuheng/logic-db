let logic = require ("logic-db")

let drinks = new logic.db_t

drinks.i ({ person: "john",  alcohol: "martini" })
drinks.i ({ person: "mary",  alcohol: "gin" })
drinks.i ({ person: "susan", alcohol: "vodka" })
drinks.i ({ person: "john",  alcohol: "gin" })
drinks.i ({ person: "fred",  alcohol: "gin" })
drinks.i ({ person: "fred",  alcohol: "vodka" })

let pair = new logic.db_t

pair.i ({
    p1: "?p1",
    p2: "?p2",
    alcohol: "?alcohol",
}) .cond ((the) => {
    return drinks.o ({ person: the.p1, alcohol: the.alcohol })
        .and (drinks.o ({ person: the.p2, alcohol: the.alcohol }))
        .not_eqv (the.p1, the.p2)
})

pair.query_log (100) ({
    p1: "?x",
    p2: "mary",
    alcohol: "gin",
})

pair.query_log (100) ({
    p1: "?x",
    p2: "?y",
    alcohol: "gin",
})

pair.query_log (100) ({
    p1: "?x",
    p2: "?y",
    alcohol: "?alcohol",
})
