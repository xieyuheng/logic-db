import assert from "assert"
import { v } from "../value"
import { Subst } from "../subst"

{
  const x = v`x`
  const subst = Subst.create().unify(123, x)
  assert(subst)
  subst.assertSuccess(x, 123)
}

{
  const x = v`x`
  const subst = Subst.create().unify({ name: "xieyuheng" }, x)
  assert(subst)
  subst.assertSuccess(x, { name: "xieyuheng" })
}

{
  const x = v`x`
  const subst = Subst.create().unify({ name: "xieyuheng" }, { name: x })
  assert(subst)
  subst.assertSuccess(x, "xieyuheng")
}

{
  const x = v`x`
  const y = v`y`
  const subst = Subst.create().unify(
    { name: "xieyuheng", items: ["a", "b", "c"] },
    { name: x, items: ["a", y, "c"] }
  )
  assert(subst)
  subst.assertSuccess(x, "xieyuheng")
  subst.assertSuccess(y, "b")
}
