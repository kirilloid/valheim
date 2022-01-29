import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import type { ComfortGroup, Effect, Piece } from '../../types';
import { pieces } from '../../data/building';
import { comfort as pageName } from '../../state';

import { TranslationContext, useGlobalState } from '../../effects';
import { InlineObject, Materials } from '../helpers';
import { ItemIcon } from '../parts/Icon';
import { isNotNull } from '../../model/utils';
import { effects } from '../../data/effects';

type Comfortable = { comfort: { value: number, group?: ComfortGroup; } };
type ComfortablePiece = Piece & Comfortable;

const isComfortPieceType = (p: Piece): p is ComfortablePiece => {
  return 'comfort' in p;
};
const allPiecesWithComfort = pieces.filter(isComfortPieceType);
const comfortables = allPiecesWithComfort.filter(p => !p.season);
const seasonal = allPiecesWithComfort.filter(p => p.season);

function getBestComfortables(maxTier: number) {
  const result: ComfortablePiece[] = [];
  const bestInGroup: Partial<Record<ComfortGroup, ComfortablePiece>> = {};
  for (const p of comfortables) {
    if (p.tier > maxTier) continue;
    const { group, value } = p.comfort;
    if (group) {
      if (value > (bestInGroup[group]?.comfort.value ?? 0)) {
        bestInGroup[group] = p;
      }
    } else {
      result.push(p);
    }
  }
  
  result.push(...Object.values(bestInGroup).filter(isNotNull));
  result.sort((a, b) => ((+!!a.season) - (+!!b.season)) || (b.tier - a.tier));
  return result;
}

const isComfortEffect = (e: Effect): e is Effect & Comfortable => {
  return 'comfort' in e;
};
const comfortEffects = effects.filter(isComfortEffect);

function totalComfort(items: Comfortable[]): number {
  return items.reduce((comfort, item) => comfort + item.comfort.value, 0);
}

function PieceRow({ piece }: { piece: ComfortablePiece }) {
  return <tr key={piece.id}>
    <td><ItemIcon item={piece} size={32} /></td>
    <td><InlineObject id={piece.id} /></td>
    <td>{piece.comfort.value}</td>
    <td>{piece.comfort.group}</td>
    <td><Materials materials={piece.recipe.materials } iconSize={32} /></td>
  </tr>
}

export function ComfortTable() {
  const [spoiler] = useGlobalState('spoiler');
  const { params } = useParams<{ params?: string }>();
  const translate = useContext(TranslationContext);
  const [onlyBest, setOnlyBest] = useState(params === 'best');
  const history = useHistory();

  useEffect(() => {
    const path = `/${pageName}/${onlyBest ? 'best' : 'all'}`;
    if (history.location.pathname !== path) {
      history.replace(path);
    }  
  }, [history, onlyBest]);

  const pieces = onlyBest
    ? getBestComfortables(spoiler)
    : comfortables.filter(p => p.tier <= spoiler);
  const seasonalPieces = seasonal.filter(p => p.tier <= spoiler);
  const effects = comfortEffects.filter(e => e.tier <= spoiler);
  const maxComfort = totalComfort(pieces) + totalComfort(effects);

  return (<>
    <h1>{translate('ui.page.comfort')}</h1>
    <div>
      <input id="all" type="radio" name="best"
        value={0} checked={!onlyBest} onChange={() => setOnlyBest(false)} />
      <label htmlFor="all">all</label>
      <input id="best" type="radio" name="best"
        value={1} checked={onlyBest} onChange={() => setOnlyBest(true)} />
      <label htmlFor="best">best</label>
    </div>
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
      {effects
        .map(effect => {
          return <tr key={effect.id}>
            <td></td>
            <td>{translate(`ui.effect.${effect.id}`)}</td>
            <td>{effect.comfort.value}</td>
            <td>{effect.comfort.group}</td>
            <td></td>
          </tr>
        })}
      {pieces
        .map(piece => <PieceRow piece={piece} />)}
      {onlyBest ?
        <tr>
          <td></td>
          <td>total</td>
          <td>{maxComfort}</td>
          <td></td>
          <td></td>
        </tr> : null}
      {seasonalPieces.map(piece => <PieceRow piece={piece} />)}
      </tbody>
    </table>
  </>);
}