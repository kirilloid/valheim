import React from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode as strHash } from '../../../model/hash';
import { boolComp } from './bool';

type ACLEntry = {
  id: bigint;
  name: string;
};

function readAcl(zdo: ZDO): ACLEntry[] {
  const length = zdo.ints.get(strHash('permitted')) ?? 0;
  const players: ACLEntry[] = [];
  for (let i = 0; i < length; i++) {
    const id = zdo.longs.get(strHash(`pu_id${i}`))!;
    const name = zdo.strings.get(strHash(`pu_name${i}`))!;
    players.push({ id, name });
  }
  return players;
}

function writeAcl(zdo: ZDO, players: ACLEntry[]) {
  zdo.ints.set(strHash('permitted'), players.length);
  for (const [i, player] of players.entries()) {
    zdo.longs.set(strHash(`pu_id${i}`), player.id);
    zdo.strings.set(strHash(`pu_name${i}`), player.name);
  }
}

const Enabled = boolComp('enabled');

export function PrivateAreaComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const players = readAcl(zdo);
  return <React.Fragment key="items">
    <dt>creator</dt>
    <dd>{zdo.strings.get(strHash('creatorName'))}</dd>
    {<Enabled value={zdo} onChange={onChange} />}
    <dt>permissions</dt>
    <dd>
      {players.length > 0
      ? <ul>{players.map((player, i) =>
          <li key={String(player.id)}>
            <button type="button" className="btn btn--danger" onClick={() => {
              writeAcl(zdo, players.filter((_, ii) => ii === i));
              const len = players.length;
              zdo.longs.delete(strHash(`pu_id${len}`));
              zdo.strings.delete(strHash(`pu_name${len}`));
              onChange(zdo);
            }}>&times;</button>
            {player.name}
          </li>
        )}</ul>
      : <em>none</em>}
    </dd>
  </React.Fragment>;
}
