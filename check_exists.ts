import { bucket } from "./bucket.ts"

const [key] = Deno.args

const exists = !!(await bucket.headObject(key))

await Deno.writeTextFile(Deno.env.get("GITHUB_OUTPUT")!, `exists=${exists}`, { append: true })
