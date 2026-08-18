declare module "libheif-js/wasm-bundle" {
  type HeifImageData = ImageData | { data: Uint8ClampedArray; width: number; height: number };

  interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(imageData: HeifImageData, callback: (result: HeifImageData | null) => void): void;
  }

  class HeifDecoder {
    decode(buffer: Uint8Array): HeifImage[];
  }

  const libheif: { HeifDecoder: typeof HeifDecoder };
  export default libheif;
}
