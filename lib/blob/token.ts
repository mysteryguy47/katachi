// Vercel names the injected token after the store (e.g. `katachi_READ_WRITE_TOKEN`)
// rather than the generic `BLOB_READ_WRITE_TOKEN` the @vercel/blob SDK looks
// for by default — this project's store is named "katachi-blob". Checking
// both keeps this working regardless of how the store gets (re)created.
export function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.katachi_READ_WRITE_TOKEN || undefined;
}
