export let encodeInto: (source: string, destination: Uint8Array) => TextEncoderEncodeIntoResult;
export let encode: (input?: string) => Uint8Array;
export let decode: (source: BufferSource) => string;

if (typeof global.TextEncoder !== 'undefined') {
  // browser
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  encodeInto = encoder.encodeInto.bind(encoder);
  encode = encoder.encode.bind(encoder);
  decode = decoder.decode.bind(decoder);
} else {
  // node
  encodeInto = (source: string, destination: Uint8Array) => {
    const bytes = Buffer.from(source, 'utf8');
    destination.set(bytes);
    return {
      written: bytes.length,
    };
  };
  encode = (source: string = '') => {
    return Buffer.from(source, 'utf8');
  }
  decode = (source: BufferSource) => {
    return Buffer.from(source).toString('utf8');
  };
}
