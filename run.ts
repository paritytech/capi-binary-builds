import { download } from "./download.ts"

const [binary, version, ...args] = Deno.args

const binaryPath = await download(binary, version)

const status = await new Deno.Command(binaryPath, {
  args,
  stdin: "inherit",
  stdout: "inherit",
  stderr: "inherit",
}).spawn().status

Deno.exit(status.code)
