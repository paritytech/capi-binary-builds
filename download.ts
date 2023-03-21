import * as path from "https://deno.land/std@0.180.0/path/mod.ts"
import getCacheDir from "https://deno.land/x/cache_dir@0.2.0/mod.ts"

const cacheDir = getCacheDir()

if (!cacheDir) throw new Error("Could not auto-detect cache dir")

const capiBinariesDir = path.join(cacheDir, "capi-binaries")

const capiBinariesApi = `https://capi-binaries.s3.amazonaws.com/`

export async function download(binary: string, version: string): Promise<string> {
  const binaryPath = path.join(capiBinariesDir, binary, version)
  await Deno.mkdir(path.dirname(binaryPath), { recursive: true })
  try {
    await Deno.stat(binaryPath)
    return binaryPath
  } catch (e) {
    if (!(e instanceof Deno.errors.NotFound)) {
      throw e
    }
  }
  const key = `${binary}/${version}/${Deno.build.target}`
  console.error("Downloading", key)
  const response = await fetch(
    new URL(key, capiBinariesApi),
  )
  if (!response.ok || !response.body) {
    throw new Error(`Could not find binary ${key}`)
  }
  const file = await Deno.open(binaryPath, { write: true, create: true })
  await response.body.pipeTo(file.writable)
  await Deno.chmod(binaryPath, 0o777)
  return binaryPath
}
