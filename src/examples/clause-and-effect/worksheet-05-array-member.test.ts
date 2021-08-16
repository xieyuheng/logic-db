// import { Table, v, rest, ty, Schema } from "../.."
// TODO use rest to support native array

// const member = new Table({
//   name: "member",
//   schema: ty.tuple(ty.string(), ty.array(ty.string())),
// })

// member.i([v`element`, [v`element`, rest(v`cdr`)]])

// member.i([v`element`, [v`car`, rest(v`cdr`)]], (v) => [
//   member.o([v`element`, v`cdr`]),
// ])

// member.assert(["john", ["paul", "john"]])
// member.assertNot(["joe", ["marx", "darwin", "freud"]])

// member.assertResults(
//   [v`element`, ["paul", "john"]],
//   [
//     ["paul", ["paul", "john"]],
//     ["john", ["paul", "john"]],
//   ]
// )

// {
//   const results = member.find(["foo", v`list`], { limit: 3 })
//   for (const result of results) {
//     console.log(JSON.stringify(result))
//   }
// }
