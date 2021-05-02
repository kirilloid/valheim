import React from 'react';
import { Link } from 'react-router-dom';

import type { EntityId } from '../types';
import type { Translator } from '../translation.effect';
import { data } from '../model/objects';
import { creatures } from '../model/creatures';
import { Icon } from './Icon';
import { Recipe } from './Recipe';

const source: Record<EntityId, EntityId[]> = {};
for (const { id, drop } of creatures) {
  for (const { item } of drop) {
    (source[item] ?? (source[item] = [])).push(id);
  }
}

function dropSource(id: EntityId, translate: Translator) {
  return (<Link to={`/obj/${id}`}>
    <Icon type="creatures" id={id} />
    {translate(id)}
  </Link>);    
}

function droppedBy(sources: EntityId[], translate: Translator) {
  return (<>
    Dropped by: {
    sources.length === 1
    ? dropSource(sources[0]!, translate)
    : <ul>{sources.map(id => <li>{dropSource(id, translate)}</li>)}</ul>}
  </>);
}

export function Source(id: EntityId, translate: Translator) {
  const sources = source[id];
  const recipe = data[id]?.recipe; 
  return <section>
    <header>source</header>
    {sources?.length ? droppedBy(sources, translate) : null}
    {recipe ? Recipe(recipe) : null}
  </section>
}