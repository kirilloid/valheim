import * as fflate from 'fflate';

type ApiCallback<E> = (err: E | null, data: Uint8Array<ArrayBuffer>) => void;

interface ApiFn<E, O> {
  (data: Uint8Array, options: O, cb: ApiCallback<E>): fflate.AsyncTerminable;
  (data: Uint8Array, cb: ApiCallback<E>): fflate.AsyncTerminable;
}

function promiseWrap<E, O>(
  apiFn: ApiFn<E, O>,
  data: Uint8Array,
  options?: O,
): Promise<Uint8Array<ArrayBuffer>> {
  return new Promise((resolve, reject) => {
    function callback(err: E | null, data: Uint8Array<ArrayBuffer>) {
      if (err) reject(err);
      else resolve(data);
    }
    if (options) apiFn(data, options, callback);
    else apiFn(data, callback);
  });
}

export const gzip = (data: Uint8Array, options?: fflate.AsyncGzipOptions) => promiseWrap(fflate.gzip, data, options);
export const gunzip = (data: Uint8Array) => promiseWrap(fflate.gunzip, data);
export const inflate = (data: Uint8Array) => promiseWrap(fflate.inflate, data);
export const deflate = (data: Uint8Array, options?: fflate.AsyncDeflateOptions) =>
  promiseWrap<fflate.FlateError, fflate.AsyncDeflateOptions>(fflate.deflate, data, options);
export const decompress = (data: Uint8Array<ArrayBuffer>, options?: fflate.AsyncInflateOptions) =>
  promiseWrap<fflate.FlateError, fflate.AsyncInflateOptions>(fflate.decompress, data, options);
