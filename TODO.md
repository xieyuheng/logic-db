- rename `Solver.find` to `Solver.solve`

- rename `Table.find` to `Table.query`

- `Table.find` -- filter out non-ground results

  - well typed projection -- with the help of `ty` schema

- `Logic.find` -- filter out non-ground results

  - well typed projection -- with the help of `ty` schema

- goals -- and -- And
- goals -- or -- Or

- prolog's `dif` can find the least different subterm.

  - but our `ne` can not.

- goals -- not -- Not

  - [question] this will break the definition of horn clause?

- goals -- eqv with proposition
- goals -- low level predicate

- `Ctx` -- where to use?

# examples

- clause-and-effect
  - worksheet-08-maximum-of-a-list.test.ts

- the-power-of-prolog
  - water-jug-problem.test.ts

- sicp
  - a-boston-high-tech-company.test.ts
  - logic-as-programs.test.ts

# later

- well typed `projection` of query result -- with the help of `ty`

  - we need to accept `Var`

- validate insertion -- we need to accept `Var`

  - use `ty.guard` to handle `Var`
  - how to handle `Logical<T>`?

- `Db`
- `Db` -- stream
- `Db` -- cache
- `Db` -- index
- `Connection`

- error handling

# maybe

- use rest to support native array ?

  - test by worksheet-05-array-member
