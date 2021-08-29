- goals -- `Not`

  - [question] this will break the definition of horn clause?
    - learn more about resolution and logic purity

- goals -- eqv with proposition
- goals -- low level predicate

- higher order predicate

- `Ctx` -- where to use?

# CLP

- `dif` -- base CLP

- CLP for `int`

- CLP is re-defining equal, what is its related to quotient type?

# DCG

# alpha-kanren

- learn about alpha-kanren -- is it related to higher order unification?

# interface for unification

- be able to define new class which can do unification

# procedural reading

- the solver should explain its resolution strategy in "procedural reading" style.

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

- prolog's `dif` can find the least different subterm.

  - but our `ne` can not.

- `Db`
  - `Db` -- stream
  - `Db` -- cache
  - `Db` -- index
  - `Connection`

- error handling

# maybe

- use rest to support native array ?

  - test by worksheet-05-array-member
