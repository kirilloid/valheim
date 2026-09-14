type BrotliModule = typeof import('brotli-compress');

let modulePromise: Promise<BrotliModule> | undefined;

function getModule(): Promise<BrotliModule> {
  modulePromise ??= import('brotli-compress');
  return modulePromise;
}

async function transform(data: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array<ArrayBuffer>> {
  const writer = stream.writable.getWriter();
  const reader = stream.readable.getReader();
  const chunks: Uint8Array[] = [];
  const readPromise = (async () => {
    for (;;) {
      const result = await reader.read();
      if (result.done) break;
      chunks.push(result.value);
    }
  })();
  await writer.write(data as BufferSource);
  await writer.close();
  await readPromise;
  const length = chunks.reduce((total, chunk) => total + chunk.byteLength, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

async function nativeCompress(data: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
  const stream = new CompressionStream('brotli' as unknown as CompressionFormat);
  return transform(data, stream);
}

async function nativeDecompress(data: Uint8Array): Promise<Uint8Array<ArrayBuffer>> {
  const stream = new DecompressionStream('brotli' as unknown as CompressionFormat);
  return transform(data, stream);
}

export async function compress(data: Uint8Array): Promise<Uint8Array<ArrayBufferLike>> {
  try {
    if (typeof globalThis.CompressionStream === 'function') {
      return await nativeCompress(data);
    }
  } catch {
    // show toast notification maybe
  }
  return (await getModule()).compress(data);
}

export async function decompress(data: Uint8Array): Promise<Uint8Array<ArrayBufferLike>> {
  try {
    if (typeof globalThis.DecompressionStream === 'function') {
      return await nativeDecompress(data);
    }
  } catch {
    // show toast notification maybe
  }
  return (await getModule()).decompress(data);
}