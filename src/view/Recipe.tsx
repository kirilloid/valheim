import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import { CraftingStation, Item } from '../types';

export function Recipe(recipe: Item['recipe']) {
  if (recipe == null) return null;
  if ('value' in recipe) {
    return <>
      Bought from <Link to="/info/trader">trader</Link> for {recipe.value} <Icon type="icon" id="coin_32" size={16} />
    </>;
  }
  if ('number' in recipe) {
    return <>
      Crafted {recipe.number} in {CraftingStation[recipe.source.station]} with:
      <ul>
        {Object.entries(recipe.materials).map(([id, num]) => <li>{num}x <Link to={`/obj/${id}`}>{id}</Link></li>)}
      </ul>
    </>
  }
  return <>
    Crafted in {CraftingStation[recipe.source.station]} lvl{recipe.source.level} with:
    <ul>
      {Object.entries(recipe.materials).map(([id, num]) => <li>{num}x <Link to={`/obj/${id}`}>{id}</Link></li>)}
    </ul>
  </>
}
