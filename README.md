# LogicDB

Embedding a Prolog-like logic programming language in JavasScript and TypeScript.

- Combining logic programming and database management.
- Can declare relations between JSON documents.
- Well typed relation in TypeScript.
- Practical and simple API.

## Install

``` bash
npm i logic-db
```

## Usage

``` typescript
import Logic, { v, ne, ty } from "logic-db"

// NOTE Drinking Pairs -- example from "Clause and Effect"

const drinks = new Logic.Table({
  name: "drinks",
  schema: ty.object({
    person: ty.string(),
    alcohol: ty.string(),
  }),
})

drinks.i({ person: "john", alcohol: "martini" })
drinks.i({ person: "mary", alcohol: "gin" })
drinks.i({ person: "susan", alcohol: "vodka" })
drinks.i({ person: "john", alcohol: "gin" })
drinks.i({ person: "fred", alcohol: "gin" })
drinks.i({ person: "fred", alcohol: "vodka" })

const pair = new Logic.Table({
  name: "pair",
  schema: ty.object({
    p1: ty.string(),
    p2: ty.string(),
    alcohol: ty.string(),
  }),
})

pair.i({ p1: v`p1`, p2: v`p2`, alcohol: v`alcohol` }, (v) => [
  drinks.o({ person: v`p1`, alcohol: v`alcohol` }),
  drinks.o({ person: v`p2`, alcohol: v`alcohol` }),
  ne(v`p1`, v`p2`),
])

console.log(pair.query({ p1: v`x`, p2: "mary", alcohol: "gin" }))
console.log(pair.query({ p1: v`x`, p2: v`y`, alcohol: "gin" }))
console.log(pair.query({ p1: v`x`, p2: v`y`, alcohol: v`alcohol` }))
```

## Examples

[**Clause and Effect**](src/examples/clause-and-effect)
- By William F. Cloeksin.

[**Structure and Interpretation of Computer Programs (SICP)**](src/examples/sicp)
- By Harold Abelson and Gerald Jay Sussman.
- It has one section about logic programming:
  - [sarabander-sicp](http://sarabander.github.io/sicp/html/4_002e4.xhtml#g_t4_002e4)
  - [official](http://mitpress.mit.edu/sites/default/files/sicp/full-text/book/book-Z-H-29.html#%_sec_4.4)

[**The Power of Prolog**](src/examples/the-power-of-prolog)
- [An excellent modern teaching of Prolog](https://www.metalevel.at/prolog), by Markus Triska.

## API Docs

TODO

## Contributions

> Be polite, do not bring negative emotion to others.

- [TODO.md](TODO.md)
- [STYLE-GUIDE.md](STYLE-GUIDE.md)
- [CODE-OF-CONDUCT.md](CODE-OF-CONDUCT.md)
- When contributing, add yourself to [AUTHORS](AUTHORS)

## License

- [GPLv3](LICENSE)
