import React from 'react';

function showSize(size: number): string {
  if (size < 1000) return `${size} B`;
  if (size < 2e5) return `${(size / 1024).toPrecision(3)} KB`;
  if (size < 2e8) return `${(size / 1024 ** 2).toPrecision(3)} MB`;
  return `${(size / 1024 ** 3).toPrecision(3)} GB`;
}

export function FileInfo({ version, file }: { version: number, file: File }) {
  return <dl>
    <dt>name</dt><dd>{file.name}</dd>
    <dt>version</dt><dd>{version}</dd>
    <dt>size</dt><dd>{showSize(file.size)}</dd>
    <dt>modified</dt><dd>{new Date(file.lastModified).toString()}</dd>
  </dl>;
}
