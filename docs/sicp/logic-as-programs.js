let logic = require ("logic-db")

function cons (x, y) { return { car: x, cdr: y } }

{
    // function

    function append (ante, succ) {
        if (ante === null) {
            return succ
        } else {
            return cons (ante.car, append (ante.cdr, succ))
        }
    }

    append (cons (1, cons (2, null)), cons (3, cons (4, null)))
    // equals to
    cons (1, cons (2, cons (3, cons (4, null))))

}

{
    // relation

    let append = new logic.db_t

    append.i ({
        ante: null,
        succ: "?succ",
        result: "?succ",
    })

    append.i ({
        ante: { car: "?car", cdr: "?ante_cdr" },
        succ: "?succ",
        result: { car: "?car", cdr: "?result_cdr" },
    }) .cond ((the) => {
        return append.o ({
            ante: the.ante.cdr,
            succ: the.succ,
            result: the.result.cdr,
        })
    })

    append.query_log (1) ({
        ante: cons (1, cons (2, null)),
        succ: cons (3, cons (4, null)),
        result: "?result",
    })

    // run it backward

    append.query_log (10) ({
        ante: "?ante",
        succ: "?succ",
        result: cons (1, cons (2, cons (3, cons (4, null)))),
    })
}

{
    // function

    function merge (ante, succ) {
        if (ante === null) {
            return succ
        } else if (succ === null) {
            return ante
        } else if (ante.car < succ.car) {
            return cons (ante.car, merge (ante.cdr, succ))
        } else {
            return cons (succ.car, merge (ante, succ.cdr))
        }
    }

    merge (cons (1, cons (3, null)), cons (2, cons (4, null)))
    // equals to
    cons (1, cons (2, cons (3, cons (4, null))))
}

{
    // relation

    let merge = new logic.db_t

    merge.i ({
        ante: null,
        succ: "?succ",
        result: "?succ",
    })

    merge.i ({
        ante: "?ante",
        succ: null,
        result: "?ante",
    })

    merge.i ({
        ante: { car: "?ante_car", cdr: "?ante_cdr" },
        succ: { car: "?car", cdr: "?succ_cdr" },
        result: { car: "?car", cdr: "?result_cdr" },
    }) .cond ((the) => {
        return merge.o ({
            ante: the.ante,
            succ: the.succ.cdr,
            result: the.result.cdr,
        }) .pred_with_bind ({
            ante_car: the.ante.car,
            succ_car: the.succ.car,
        }, (bind) => bind.ante_car > bind.succ_car)
    })

    merge.i ({
        ante: { car: "?car", cdr: "?ante_cdr" },
        succ: { car: "?succ_car", cdr: "?succ_cdr" },
        result: { car: "?car", cdr: "?result_cdr" },
    }) .cond ((the) => {
        return merge.o ({
            ante: the.ante.cdr,
            succ: the.succ,
            result: the.result.cdr,
        }) .pred_with_bind ({
            ante_car: the.ante.car,
            succ_car: the.succ.car,
        }, (bind) => bind.ante_car < bind.succ_car)
    })

    merge.query_log (1) ({
        ante: cons (1, cons (2, null)),
        succ: cons (3, cons (4, null)),
        result: "?result",
    })

    merge.query_log (1) ({
        ante: cons (1, cons (3, null)),
        succ: cons (2, cons (4, null)),
        result: "?result",
    })

    merge.query_log (10) ({
        ante: "?ante",
        succ: "?succ",
        result: cons (1, cons (2, cons (3, cons (4, null)))),
    })
}
