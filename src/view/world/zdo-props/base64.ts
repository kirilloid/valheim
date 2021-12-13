import { PackageReader } from '../../../file/Package';

export function readBase64(base64: string): PackageReader {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new PackageReader(bytes);
}
