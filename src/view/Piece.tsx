import React, { useContext } from 'react';
import { getCraftingStationId, getStructuralIntegrity } from '../model/building';
import { assertNever, GAME_DAY, timeI2S } from '../model/utils';
import { TranslationContext } from '../translation.effect';

import { ItemType, MaterialType, Piece as TPiece } from '../types';
import { Resistances } from './helpers';
import { Icon } from './Icon';
import { Recipe } from './Source';

function PieceSpecific({ item }: { item: TPiece }) {
  const translate = useContext(TranslationContext);
  switch (item.subtype) {
    case 'fireplace': {
      const { fuel, burnTime, capacity, minHeightAbove, smoke, fireworks } = item.fireplace;
      const totalTime = burnTime * capacity;
      return (<dl>
        <dt>fuel type</dt><dd><Icon type="resource" id={fuel} />{' '}{translate(fuel)}</dd>
        <dt>capacity</dt><dd>{capacity}</dd>
        <dt>burn time</dt><dd>{timeI2S(burnTime)}</dd>
        <dt>total burn time</dt><dd>{timeI2S(totalTime)} = {(totalTime / GAME_DAY).toPrecision(2)} days</dd>
        <dt>min height to cover</dt><dd>{minHeightAbove}m</dd>
        <dt>smoke</dt><dd>{smoke ? '✔️' : '❌'}</dd>
        <dt>fireworks</dt><dd>{fireworks ? '✔️' : '❌'}</dd>
      </dl>);
    }
    case 'craft': {
      const { requiresFire, requiresRoof, buildRange, queueSize } = item.craft;
      return (<dl>
        <dt>requires fire</dt><dd>{requiresFire ? '✔️' : '❌'}</dd>
        <dt>requires roof</dt><dd>{requiresRoof ? '✔️' : '❌'}</dd>
        {buildRange ? <><dt>building radius</dt><dd>{buildRange}m</dd></> : null}
        {queueSize ? <><dt>queued</dt><dd>{queueSize}</dd></> : null}
      </dl>);
    }
    case 'craft_ext': {
      const { id, distance, requiresFire, requiresRoof } = item.extends;
      return (<dl>
        <dt>extends</dt><dd>{translate(getCraftingStationId(id))}</dd>
        <dt>requires fire</dt><dd>{requiresFire ? '✔️' : '❌'}</dd>
        <dt>requires roof</dt><dd>{requiresRoof ? '✔️' : '❌'}</dd>
        <dt>max distance</dt><dd>{distance}m</dd>
      </dl>);
    }
    case 'misc':
      return (<dl>
      
      </dl>);
    case 'structure': {
      const { materialType } = item.wear;
      if (materialType == null) return null;
      const { minSupport, maxSupport, horizontalLoss, verticalLoss } = getStructuralIntegrity(materialType);
      const supportRate = maxSupport / minSupport;
      const horizontalDistance = Math.floor(Math.log(supportRate) / -Math.log(1 - horizontalLoss));
      const verticalDistance = Math.floor(Math.log(supportRate) / -Math.log(1 - verticalLoss));
      return (<dl>
        <dt>material type</dt><dd>{MaterialType[materialType]}</dd>
        <dt>min vertical</dt><dd>{verticalDistance}m</dd>
        <dt>max horizontal</dt><dd>{horizontalDistance}m</dd>
      </dl>);
    }
    case 'door':
      return null;
    case 'bed':
    case 'chair':
    case 'table':
    case 'decoration': {
      const { value, group } = item.comfort;
      return (<dl>
        <dt>comfort</dt><dd>{value}</dd>
        {group ? <><dt>comfort group</dt><dd>{group}</dd></> : null}
      </dl>);
    }
    case 'stand':
      return (<dl>
        <dt>supported items</dt>
        <dd><ul>{item.supportedTypes.map(t => ItemType[t]).join(', ')}</ul></dd>
      </dl>);
    case 'chest': {
      const { space: [width, height] } = item;
      return (<dl>
        <dt>space</dt><dd>{width}x{height} = {width * height}</dd>
      </dl>);
    }
    default:
      return assertNever(item);
  }
}

function reqList(piece: TPiece['piece']) {
  const { water, allowedInDungeons, groundOnly, notOnFloor, notOnWood, onlyOnFlat } = piece;
  const result: string[] = [];
  if (water === false) result.push('not in water');
  if (water === true) result.push('only in water');
  if (allowedInDungeons) result.push('allowed in dungeons');
  if (groundOnly) result.push('only on ground');
  if (notOnFloor) result.push('not on floor');
  if (notOnWood) result.push('not on wood');
  if (onlyOnFlat) result.push('needs flat surface');
  return result;
}

export function Piece(item: TPiece) {
  const { target, requiredSpace, size } = item.piece;
  const { hp, damageModifiers, noRoof } = item.wear;
  const translate = useContext(TranslationContext);
  const specialReqs = reqList(item.piece);
  return (
    <>
      <h2>
        <Icon type="piece" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      <section>
        <header>{translate(`ui.piece`)}</header>
        <dl>
          <dt>health</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          <dt>target</dt><dd>{translate(`ui.pieceTarget.${target}`)}</dd>
          <dt>degrade w/o roof</dt><dd>{noRoof ? '✔️' : '❌'}</dd>
          {specialReqs.length ? <><dt>specific</dt><dd>{specialReqs.join(', ')}</dd></> : null}
          {requiredSpace ? <><dt>required space</dt><dd>{requiredSpace}</dd></> : null}
          {size ? <><dt>size</dt><dd>{size.filter(Boolean).join('x')}</dd></> : null}
        </dl>
      </section>
      <section>
        <header>{translate(`ui.pieceType.${item.subtype}`)}</header>
        <PieceSpecific item={item} />
      </section>
      <Recipe item={item} />
    </>
  );
}