"use client";

// Decodes HEIC/HEIF via a current libheif build (the wasm-bundle variant
// requires no bundler config) and re-encodes as JPEG through canvas — no
// browser can display HEIC inline, so every upload gets normalized to
// something universally viewable.
export async function convertHeicToJpeg(file: File): Promise<Blob> {
  const libheif = (await import("libheif-js/wasm-bundle")).default;
  const buffer = new Uint8Array(await file.arrayBuffer());

  const decoder = new libheif.HeifDecoder();
  const images = decoder.decode(buffer);
  if (!images || images.length === 0) {
    throw new Error("Could not read this HEIC file.");
  }

  const image = images[0];
  const width = image.get_width();
  const height = image.get_height();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  const imageData = ctx.createImageData(width, height);

  await new Promise<void>((resolve, reject) => {
    image.display(imageData, (result) => {
      if (!result) {
        reject(new Error("Could not decode this HEIC file."));
        return;
      }
      resolve();
    });
  });

  ctx.putImageData(imageData, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode as JPEG."))),
      "image/jpeg",
      0.85,
    );
  });
}
