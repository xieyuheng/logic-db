import assert from "assert"
import { Value, v } from "../value"
import { Subst } from "../subst"

{
  const x = v("x")
  const subst = Subst.create().unify(123, x)
  assert(subst)
  subst.assertFound(x, 123)
}

{
  const x = v("x")
  const subst = Subst.create().unify({ name: "xieyuheng" }, x)
  assert(subst)
  subst.assertFound(x, { name: "xieyuheng" })
}

{
  const x = v("x")
  const subst = Subst.create().unify({ name: "xieyuheng" }, { name: x })
  assert(subst)
  subst.assertFound(x, "xieyuheng")
}

{
  const x = v("x")
  const y = v("y")
  const subst = Subst.create().unify(
    { name: "xieyuheng", items: ["a", "b", "c"] },
    { name: x, items: ["a", y, "c"] }
  )
  assert(subst)
  subst.assertFound(x, "xieyuheng")
  subst.assertFound(y, "b")
}
