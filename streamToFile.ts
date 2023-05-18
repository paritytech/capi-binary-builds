export async function streamToFile(stream: ReadableStream<Uint8Array>, filePath: string) {
  const file = await Deno.open(filePath, { write: true, create: true })
  await stream.pipeTo(file.writable)
}
