import React from 'react';

export function Wiki({ article }: { article: string }) {
  const id = article.replace(/ /g, '_');
  return <div>
    <a href={`https://valheim.fandom.com/wiki/${id}`} target="_blank">wiki:{article}</a>
  </div>
}
