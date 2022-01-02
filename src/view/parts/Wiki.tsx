import React from 'react';

export function Wiki({ article }: { article: string }) {
  const id = article.replace(/ /g, '_');
  return <a href={`https://valheim.fandom.com/wiki/${id}`}
    target="_blank"
    rel="noreferrer">
    wiki:{article}
  </a>
}
