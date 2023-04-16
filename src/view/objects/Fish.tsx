import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import '../../css/Creature.css';

import type { Fish as TFish } from '../../types';
import { objectLocationMap } from '../../data/location';
import { maxLvl } from '../../data/creatures';

import { TranslationContext } from '../../effects';
import { Area, InlineObjectWithIcon } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';
import { Source } from '../parts/Source';
import { DeadSpeak } from '../parts/DeadSpeak';

export function Fish({ fish, level = 1 }: { fish: TFish, level?: number }) {
  const translate = useContext(TranslationContext);
  const { id } = fish;
  const locations = [
    ...new Set(fish.spawners.flatMap(s => s.biomes)),
    ...(objectLocationMap[fish.id] ?? [])
  ];
  return (<>
    <ItemHeader item={fish} >
      {maxLvl(fish) > 1
      ? <div className="Switch Creature__Stars">
          {Array.from({ length: maxLvl(fish) }).map((_, stars) => 
            level === stars + 1
              ? <span key={stars} className="Switch__Option Creature__Star Switch__Option--selected Creature__Star--selected">{stars}⭐</span>
              : <Link key={stars} className="Switch__Option Creature__Star" to={`/obj/${id}/${stars + 1}`} replace={true}>{stars}⭐</Link>
          )}
        </div>
      : null}
    </ItemHeader>
    <section>
      <h2>{translate('ui.itemType.fish')}</h2>
      <dl>
        <dt>areal</dt>
        <dd>
          <ul style={{ padding: 0 }}>
            {locations.map(loc => <li key={loc}><Area area={loc} /></li>)}
          </ul>
        </dd>
        <dt>{translate('ui.moveSpeed')}</dt>
        <dd>{fish.speed}</dd>
        <dt>{translate('stamina')}</dt>
        <dd>{fish.staminaUse} / {fish.escapeStaminaUse}</dd>
      </dl>
    </section>
    <section>
      <h2>baits</h2>
      <ul className="CraftList">{Object.entries(fish.baits).map(([id, chance]) => <li key={id}>
        <InlineObjectWithIcon id={id} /> - {Math.round(chance * 100)}%
      </li>)}</ul>
    </section>
    {fish.Deadspeak && <DeadSpeak {...fish.Deadspeak} />}
    <Source id={fish.id} />
  </>);
}