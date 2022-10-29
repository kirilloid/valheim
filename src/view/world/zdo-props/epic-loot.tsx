import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/hash';
import { getEpicLootData } from '../../../mods/epic-loot';

import { TranslationContext } from '../../../effects';
import { List } from '../../helpers';

const CRAFTER_NAME = stableHashCode('crafterName');

export function EpicLootComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const crafterName = zdo.strings.get(CRAFTER_NAME);
  if (crafterName == null) return null;
  const data = getEpicLootData({ crafterName });
  if (data == null) return null;
  return <List separator="">{
    Object.entries(data.effects).map(([key, val], i) =>
      <React.Fragment key={key}>
        <dt>{data.augmentedIndex === i ? <em>augmented</em> : null}</dt>
        <dd>{translate(`ui.mod.EpicLoot.effect.${key}`, val!)}</dd>
      </React.Fragment>)
  }</List>;
};
