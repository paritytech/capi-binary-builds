import { bucket } from "./bucket.ts"

const [key, file] = Deno.args

await bucket.putObject(key, await Deno.readFile(file))
