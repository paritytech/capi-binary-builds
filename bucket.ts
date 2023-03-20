import { S3Bucket } from "https://deno.land/x/s3@0.5.0/mod.ts"

export const bucket = new S3Bucket({
  accessKeyID: Deno.env.get("S3_ACCESS_KEY")!,
  secretKey: Deno.env.get("S3_SECRET_KEY")!,
  region: Deno.env.get("S3_REGION")!,
  bucket: Deno.env.get("S3_BUCKET")!,
})
