import { PackageReader, PackageWriter } from './Package';

export function readBase64(base64: string): PackageReader {
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new PackageReader(bytes);
}

export function writeBase64(pkg: PackageWriter): string {
  const bytes = pkg.flush();
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += 1024) {
    const chunk = String.fromCharCode(...bytes.subarray(i, i + 1024));
    chunks.push(chunk);
  }
  return btoa(chunks.join(''));
}
