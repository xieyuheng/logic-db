# logic-db

Aims :
- combine logic programming and database
- practical and simple API

Features :
- embedded in js -- minimal extra syntax
- can be used without server -- for simple client web app

## Getting Start

```bash
$ npm install logic-db
```

```js
let logic = require ("logic-db")

let job = new logic.db_t

job.i ({
    name: "Hacker Alyssa P",
    dept: "computer",
    role: "programmer",
})

job.i ({
    name: "Tweakit Lem E",
    dept: "computer",
    role: "technician",
})

job.q (2) ({
    name: "?name",
    dept: "?dept",
    role: "?role"
})
```

## Docs

[docs](https://logic-db.surge.sh)

## Examples

To view the examples, clone the logic-db repo and install the dependencies :

```bash
$ git clone git://github.com/xieyuheng/logic-db
$ cd logic-db
$ npm install
```

Run example :

```bash
$ node examples/sicp/boston-high-tech-company.js
```

## Contributing

We enforce C4 as collaboration protocol :
- [The C4 RFC](https://rfc.zeromq.org/spec:42/C4)
- About Style -- observe the style of existing code and respect it

## Code Of Conduct

- [Contributor Covenant Code of Conduct](CODE-OF-CONDUCT.md)

## License

- [GPLv3](LICENSE)
