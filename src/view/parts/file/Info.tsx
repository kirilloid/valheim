import React from 'react';

function showSize(size: number): string {
  if (size < 1000) return `${size} B`;
  if (size < 2e5) return `${(size / 1024).toPrecision(3)} KB`;
  if (size < 2e8) return `${(size / 1024 ** 2).toPrecision(3)} MB`;
  return `${(size / 1024 ** 3).toPrecision(3)} GB`;
}

export function FileInfo({ version, file }: { version: number, file: File }) {
  const { name, size, lastModified } = file;
  return <dl>
    <dt>name</dt><dd>{name}</dd>
    <dt>version</dt><dd>{version}</dd>
    <dt>size</dt><dd>{showSize(size)}</dd>
    <dt>modified</dt><dd>{new Date(lastModified).toString()}</dd>
  </dl>;
}

export function FilesInfo({ version, files }: { version: number, files: File[] }) {
  const size = files.reduce((a, f) => f.size + a, 0);
  const lastModified = Math.max(...files.map(f => f.lastModified));
  return <dl>
    <dt>files</dt><dd>{files.length}</dd>
    <dt>version</dt><dd>{version}</dd>
    <dt>size</dt><dd>{showSize(size)}</dd>
    <dt>modified</dt><dd>{new Date(lastModified).toString()}</dd>
  </dl>;
}
