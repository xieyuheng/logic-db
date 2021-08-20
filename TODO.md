- refactor `Logic.find` & `Logic.query`
- refactor `Table.find` & `Table.query`

- goals -- `Not`

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

# writing proof by hand

- if we use named clause, we can use the name to express choice, and write proof by hand.

# procedural reading

- the solver should explain its resolution strategy in "procedural reading" style.

# relational algebra

- we can do relational algebra in prolog,
  by saying along which logic variable
  (just like in SQL we join over a key).

  This means relational algebra is already a algebra
  in which we can product two element along different ways.

  We can borrow its syntax in higher dimensional algebra.

  - We should do low dimensional algebras first -- 0, 1, 2, 3.

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
