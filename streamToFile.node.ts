import { type FileHandle, open } from "node:fs/promises"
import { Writable } from "node:stream"

export async function streamToFile(stream: ReadableStream<Uint8Array>, filePath: string) {
  let file: FileHandle | undefined
  try {
    file = await open(filePath, "w")
    await stream.pipeTo(Writable.toWeb(file.createWriteStream()))
  } finally {
    await file?.close()
  }
}
