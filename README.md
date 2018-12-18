# logic db

Aims :
- combine logic programming and database in js
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

- [online docs](https://logic-db.surge.sh)

- To view docs locally :

```bash
$ git clone git://github.com/xieyuheng/logic-db
$ cd logic-db
$ npm install
$ npx vuepress dev ./docs
```

- To run examples :

```bash
$ node docs/sicp/a-boston-high-tech-company.js
```

## Contributing

We enforce C4 as collaboration protocol :
- [The C4 RFC](https://rfc.zeromq.org/spec:42/C4)
- About Style -- observe the style of existing code and respect it

## Code Of Conduct

- [Contributor Covenant Code of Conduct](CODE-OF-CONDUCT.md)

## License

- [GPLv3](LICENSE)
