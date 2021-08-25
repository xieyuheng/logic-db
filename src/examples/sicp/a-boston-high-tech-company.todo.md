## Compound queries

We create new `logic.db_t` to specify compound queries.

`.not`

```js
let bigshot = new logic.db_t()

bigshot
  .i({
    name: "?name",
    dept: "?dept",
  })
  .cond((the) => {
    let z = new logic.var_t()
    return job
      .o({ name: the.var.name, dept: the.var.dept })
      .not(
        supervisor
          .o({ slave: the.var.name, master: z })
          .and(job.o({ name: z, dept: the.var.dept }))
      )
  })

bigshot.query_log(100)({
  name: "?name",
  dept: "?dept",
})
```

`.pred`

```js
let not_so_poor = new logic.db_t()

not_so_poor
  .i({
    name: "?name",
    amount: "?amount",
  })
  .cond((the) => {
    return salary
      .o({ name: the.var.name, amount: the.var.amount })
      .pred((subst) => subst.get(the.var.amount) >= 40000)
  })

not_so_poor.query_log(10)({
  name: "?name",
  amount: "?amount",
})
```
