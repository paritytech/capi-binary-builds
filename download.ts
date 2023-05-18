import * as path from "https://deno.land/std@0.180.0/path/mod.ts"
import getCacheDir from "https://deno.land/x/cache_dir@0.2.0/mod.ts"
import { streamToFile } from "./streamToFile.ts"

const capiBinariesApi = `https://capi-binaries.s3.amazonaws.com/`

export function getBinariesDir() {
  const cacheDir = getCacheDir()
  if (!cacheDir) throw new Error("Could not auto-detect cache dir")
  const binariesDir = path.join(cacheDir, "capi-binaries")
  return binariesDir
}

const memo = new Map<string, CapiBinary>()

export class CapiBinary {
  path
  key
  constructor(readonly binary: string, readonly version: string) {
    this.path = path.join(getBinariesDir(), `capi-${binary}-${version}`)
    this.key = `${this.binary}/${this.version}/${Deno.build.target}`
    const existing = memo.get(this.key)
    if (existing) return existing
    memo.set(this.key, this)
  }

  #exists?: Promise<boolean>
  exists(): Promise<boolean> {
    return this.#downloading?.then(() => true) ?? (this.#exists ??= (async () => {
      try {
        await Deno.stat(this.path)
        return true
      } catch (e) {
        if (!(e instanceof Deno.errors.NotFound)) {
          throw e
        }
        return false
      }
    })())
  }

  #downloading?: Promise<void>
  async download() {
    if (await this.exists()) return
    return this.#downloading ??= (async () => {
      const response = await fetch(
        new URL(this.key, capiBinariesApi),
      )
      if (!response.ok || !response.body) {
        throw new Error(`Could not find binary ${this.key}`)
      }
      await Deno.mkdir(getBinariesDir(), { recursive: true })
      const tempFile = path.join(getBinariesDir(), `tmp-${crypto.randomUUID()}`)
      await streamToFile(response.body, tempFile)
      await Deno.chmod(tempFile, 0o777)
      await Deno.rename(tempFile, this.path)
      return
    })()
  }
}

export function binary(binary: string, version: string) {
  return new CapiBinary(binary, version)
}
