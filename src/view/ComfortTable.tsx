import React, { useContext } from 'react';

import type { Piece } from '../types';
import { pieces } from '../data/building';

import { TranslationContext, useGlobalState } from '../effects';
import { InlineObject, Materials } from './helpers';
import { ItemIcon } from './Icon';

const isComfortPieceType = (p: Piece): p is Piece & { comfort: any } => {
  return 'comfort' in p;
};
const comfortables = pieces.filter(isComfortPieceType);

export function ComfortTable() {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);

  return (<>
    <h1>{translate('ui.page.comfort')}</h1>
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>icon</th>
          <th>name</th>
          <th>{translate('ui.comfort')}</th>
          <th>group</th>
          <th>{translate('ui.resources')}</th>
        </tr>
      </thead>
      <tbody>
      {comfortables
        .filter(p => p.tier <= spoiler)
        .map(piece => {
          return <tr key={piece.id}>
            <td><ItemIcon item={piece} size={32} /></td>
            <td><InlineObject id={piece.id} /></td>
            <td>{piece.comfort.value}</td>
            <td>{piece.comfort.group}</td>
            <td><Materials materials={piece.recipe.materials } iconSize={32} /></td>
          </tr>
        })}
      </tbody>
    </table>
  </>);
}