import React from 'react';

export function FileInfo({ version, file }: { version: number, file: File }) {
  return <dl>
    <dt>version</dt><dd>{version}</dd>
    <dt>name</dt><dd>{file.name}</dd>
    <dt>size</dt><dd>{(file.size / 1024 ** 2).toPrecision(3)} MB</dd>
    <dt>modified</dt><dd>{new Date(file.lastModified).toString()}</dd>
  </dl>;
}
