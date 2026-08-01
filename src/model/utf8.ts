export let encodeInto: (source: string, destination: Uint8Array) => TextEncoderEncodeIntoResult;
export let encode: (input?: string) => Uint8Array;
export let decode: (source: Uint8Array) => string;

if (typeof globalThis.TextEncoder !== 'undefined') {
  // browser
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  encodeInto = encoder.encodeInto.bind(encoder);
  encode = encoder.encode.bind(encoder);
  decode = decoder.decode.bind(decoder);
} else {
  // old node
  encodeInto = (source: string, destination: Uint8Array) => {
    const bytes = Buffer.from(source, 'utf8');
    destination.set(bytes);
    return {
      read: source.length,
      written: bytes.length,
    };
  };
  encode = (source: string = '') => {
    return Buffer.from(source, 'utf8');
  }
  decode = (bytes: Uint8Array) => {
    return Buffer.from(bytes).toString('utf8');
  };
}
