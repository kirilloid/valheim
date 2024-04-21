import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { ItemType, MaterialType, Piece as TPiece, SapCollector } from '../../types';

import { getStructuralIntegrity, pieces } from '../../data/building';
import { stationsMap, Produced } from '../../data/resource-usage';
import { assertNever, days, timeI2S } from '../../model/utils';

import { TranslationContext, useGlobalState } from '../../effects';
import { InlineObjectWithIcon, Light, List, Resistances, showNumber, yesNo } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';
import { Recipe } from '../parts/Source';

function PieceSpecific({ item }: { item: TPiece }) {
  const translate = useContext(TranslationContext);
  switch (item.subtype) {
    case 'fireplace': {
      const { fuel, burnTime, capacity, minHeightAbove, smoke, fireworks } = item.fireplace;
      const totalTime = burnTime * capacity;
      return (<dl>
        <dt>fuel type</dt><dd><InlineObjectWithIcon id={fuel} /></dd>
        <dt>capacity</dt><dd>{capacity}</dd>
        <dt>burn time</dt><dd>{timeI2S(burnTime)}</dd>
        <dt>total burn time</dt><dd>{timeI2S(totalTime)} = {days(totalTime).toPrecision(2)} days</dd>
        <dt>min height to cover</dt><dd>{minHeightAbove}m</dd>
        <dt>smoke</dt><dd>{yesNo(smoke)}</dd>
        <dt>fireworks</dt><dd>{yesNo(fireworks)}</dd>
      </dl>);
    }
    case 'craft': {
      const { requiresFire, requiresRoof, buildRange, queueSize } = item.craft;
      const extensions = pieces.filter(p => p.subtype === 'craft_ext' && p.extends.id === item.id);
      return (<>
        <dl>
          <dt>{translate('ui.crafting.needsFire')}</dt><dd>{yesNo(requiresFire)}</dd>
          <dt>{translate('ui.crafting.needsRoof')}</dt><dd>{yesNo(requiresRoof)}</dd>
          {buildRange ? <><dt>building radius</dt><dd>{buildRange}m</dd></> : null}
          {queueSize ? <><dt>queued</dt><dd>{queueSize}</dd></> : null}
        </dl>
        {extensions.length > 0 && <>
          <h2>{translate('ui.crafting.extensions')}</h2>
          <ul>
            {extensions.map(p => <li key={p.id}><InlineObjectWithIcon id={p.id} /></li>)}
          </ul>
        </>}
      </>);
    }
    case 'craft_ext': {
      const { id, distance, requiresFire, requiresRoof } = item.extends;
      return (<dl>
        <dt>{translate('ui.crafting.extends')}</dt><dd><InlineObjectWithIcon id={id} /></dd>
        <dt>{translate('ui.crafting.needsFire')}</dt><dd>{yesNo(requiresFire)}</dd>
        <dt>{translate('ui.crafting.needsRoof')}</dt><dd>{yesNo(requiresRoof)}</dd>
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
        <dt>{translate('ui.comfort')}</dt><dd>{value}</dd>
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
        <dt>space</dt><dd>{width}×{height} = {width * height}</dd>
      </dl>);
    }
    case 'external':
      return null;
    default:
      return assertNever(item);
  }
}

function reqList(piece: TPiece['piece']) {
  if (piece == null) return null;
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

function CraftList({ items }: { items: Produced[] }) {
  const [mods] = useGlobalState('searchInMods');

  return <ul className="CraftList">
    {(mods ? items : items.filter(item => item.mod == null)).map(item => <li key={item.id}>
      <InlineObjectWithIcon id={item.id} />
    </li>)}
  </ul>
}

function ProducedItems({ items }: { items: Map<number, Produced[]> }) {
  if (items.size === 0) return null;
  if (items.size === 1) {
    for (const perLevelItems of items.values()) {
      return <CraftList items={perLevelItems} />
    }
  }
  return <>
    <h2>Produces</h2>
    {[...items.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([level, levelItems]) => <React.Fragment>
        <h4>Level {level}</h4>
        <CraftList items={levelItems} />
      </React.Fragment>
      )}
  </>;
}

function ResourceExtractor({ from, maxLevel, secPerUnit, item }: SapCollector) {
  return <dl>
    <dt>resource</dt><dd><InlineObjectWithIcon id={item} size={24} /></dd>
    <dt>from</dt><dd><InlineObjectWithIcon id={from} size={24} /></dd>
    <dt>max capacity</dt><dd>{maxLevel}</dd>
    <dt>fill rate</dt><dd>{timeI2S(secPerUnit)} per 1 item</dd>
  </dl>
}

export function Piece({ item }: { item: TPiece }) {
  const target = item.piece?.target;
  const requiredSpace = item.piece?.requiredSpace;
  const size = item.piece?.size;
  const blockingPieces = item.blockingPieces;
  const { hp, damageModifiers, noRoof } = item.wear;
  const translate = useContext(TranslationContext);
  const specialReqs = reqList(item.piece);
  const producedItems = (item.subtype === 'craft' && stationsMap.get(item.id)) || new Map<number, Produced[]>();
  return (
    <>
      <ItemHeader item={item} />
      <section key="general">
        <h2>{translate('ui.piece')}</h2>
        <dl>
          <dt>{translate('ui.healthStructure')}</dt><dd>{hp}</dd>
          <Resistances mods={damageModifiers} />
          <dt>base <Link to="/info/base">ℹ️</Link></dt><dd>{yesNo(item.base)}</dd>
          <dt title="can burn to the ground in Ashlands or with 'Flame' world modifier">flammable 🔥</dt><dd>{yesNo(item.burnable ?? true)}</dd>
          <dt>{translate('ui.pieceTarget')}</dt><dd>{translate(`ui.pieceTarget.${target}`)}</dd>
          <dt>degrades w/o roof</dt><dd>{yesNo(noRoof)}</dd>
          {specialReqs?.length ? <React.Fragment key="specific"><dt>specific</dt><dd>{specialReqs.join(', ')}</dd></React.Fragment> : null}
          {blockingPieces ? <React.Fragment key="blocking-pieces">
            <dt>blocked by</dt><dd><List>{blockingPieces.pieces.map(id => <InlineObjectWithIcon id={id} key={id} size={24} />)}</List></dd>
            <dt>within radius</dt><dd>{blockingPieces.radius}</dd>
          </React.Fragment> : null}
          {requiredSpace ? <React.Fragment key="req-space"><dt>required space</dt><dd>{requiredSpace}m</dd></React.Fragment> : null}
          {size ? <React.Fragment key="size"><dt>size</dt><dd>{size.filter(Boolean).join('×')}</dd></React.Fragment> : null}
          {item.PointLight ? <React.Fragment key="PointLight"><dt>{translate('ui.tags.light')}</dt><dd><Light {...item.PointLight} /></dd></React.Fragment> : null}
        </dl>
      </section>
      {item.SapCollector && <section key="SapCollector">
        <h2>Resource extractor</h2>
        <ResourceExtractor {...item.SapCollector} />
      </section>}
      {item.Aoe && <section key="damage">
        <h2>Damage on contact/activation</h2>
        <dl>
          {Object.entries(item.Aoe.damage)
            .filter(([, value]) => value)
            .map(([key, value]) => (<React.Fragment key={key}>
              <dt>{translate(`ui.damageType.${key}`)}</dt>
              <dd>{value}</dd>
            </React.Fragment>))}
        </dl>
      </section>}
      {item.ShieldGenerator && <section key="damage">
        <h2>Shield Generator</h2>
        <dl>
          <dt>fuel</dt><dd><List separator=" | ">{item.ShieldGenerator.fuelItems.map(fuel => <InlineObjectWithIcon id={fuel} key={fuel} />)}</List></dd>
          <dt>max fuel</dt><dd>{item.ShieldGenerator.maxFuel}</dd>
          <dt>damage per unit of fuel</dt><dd>{showNumber(1 / item.ShieldGenerator.fuelPerDamage)}</dd>
        </dl>
      </section>}
      <section key="specific">
        <h2>{translate(`ui.pieceType.${item.subtype}`)}</h2>
        <PieceSpecific item={item} />
      </section>
      <Recipe item={item} />
      <ProducedItems items={producedItems} />
    </>
  );
}