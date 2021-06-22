import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { getCraftingStationId, getStructuralIntegrity } from '../model/building';
import { data } from '../model/objects';
import { stationsMap } from '../model/resource-usage';
import { assertNever, GAME_DAY, timeI2S } from '../model/utils';
import { TranslationContext } from '../effects';

import { ItemType, MaterialType, Piece as TPiece } from '../types';
import { Resistances, yesNo } from './helpers';
import { ItemIcon } from './Icon';
import { ItemHeader } from './ItemHeader';
import { Recipe } from './Source';

function PieceSpecific({ item }: { item: TPiece }) {
  const translate = useContext(TranslationContext);
  switch (item.subtype) {
    case 'fireplace': {
      const { fuel, burnTime, capacity, minHeightAbove, smoke, fireworks } = item.fireplace;
      const totalTime = burnTime * capacity;
      return (<dl>
        <dt>fuel type</dt><dd><ItemIcon item={data[fuel]} />{' '}{translate(fuel)}</dd>
        <dt>capacity</dt><dd>{capacity}</dd>
        <dt>burn time</dt><dd>{timeI2S(burnTime)}</dd>
        <dt>total burn time</dt><dd>{timeI2S(totalTime)} = {(totalTime / GAME_DAY).toPrecision(2)} days</dd>
        <dt>min height to cover</dt><dd>{minHeightAbove}m</dd>
        <dt>smoke</dt><dd>{yesNo(smoke)}</dd>
        <dt>fireworks</dt><dd>{yesNo(fireworks)}</dd>
      </dl>);
    }
    case 'craft': {
      const { requiresFire, requiresRoof, buildRange, queueSize } = item.craft;
      return (<dl>
        <dt>requires fire</dt><dd>{yesNo(requiresFire)}</dd>
        <dt>requires roof</dt><dd>{yesNo(requiresRoof)}</dd>
        {buildRange ? <><dt>building radius</dt><dd>{buildRange}m</dd></> : null}
        {queueSize ? <><dt>queued</dt><dd>{queueSize}</dd></> : null}
      </dl>);
    }
    case 'craft_ext': {
      const { id, distance, requiresFire, requiresRoof } = item.extends;
      return (<dl>
        <dt>extends</dt><dd>{translate(getCraftingStationId(id))}</dd>
        <dt>requires fire</dt><dd>{yesNo(requiresFire)}</dd>
        <dt>requires roof</dt><dd>{yesNo(requiresRoof)}</dd>
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
        <dt>max vertical</dt><dd>{verticalDistance}m</dd>
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

export function Piece({ item }: { item: TPiece }) {
  const { target, requiredSpace, size } = item.piece;
  const { hp, damageModifiers, noRoof } = item.wear;
  const translate = useContext(TranslationContext);
  const specialReqs = reqList(item.piece);
  const producedItems = (item.subtype === 'craft' && stationsMap.get(item.craft.id)) || [];
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <h2>{translate(`ui.piece`)}</h2>
        <dl>
          <dt>health</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          <dt>target</dt><dd>{translate(`ui.pieceTarget.${target}`)}</dd>
          <dt>degrades w/o roof</dt><dd>{yesNo(noRoof)}</dd>
          {specialReqs.length ? <><dt>specific</dt><dd>{specialReqs.join(', ')}</dd></> : null}
          {requiredSpace ? <><dt>required space</dt><dd>{requiredSpace}</dd></> : null}
          {size ? <><dt>size</dt><dd>{size.filter(Boolean).join('x')}</dd></> : null}
        </dl>
      </section>
      <section>
        <h2>{translate(`ui.pieceType.${item.subtype}`)}</h2>
        <PieceSpecific item={item} />
      </section>
      <Recipe item={item} />
      {producedItems.length
      ? <><h2>Produces</h2>
          <ul>{producedItems.map(item => <li key={item.id}>
            <ItemIcon item={item} />
            {' '}
            <Link to={`/obj/${item.id}`}>{translate(item.id)}</Link>
          </li>)}</ul>
        </>
      : null}
    </>
  );
}