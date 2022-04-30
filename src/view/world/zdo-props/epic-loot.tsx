import React, { useContext } from 'react';

import type { ValueProps } from '../../parts/types';
import type { ZDO } from '../types';

import { stableHashCode } from '../../../model/utils';
import { extractExtraData } from '../../../mods/epic-loot';

import { TranslationContext } from '../../../effects';
import { List } from '../../helpers';

const CRAFTER_NAME = stableHashCode('crafterName');

export function EpicLootComp({ value: zdo, onChange }: ValueProps<ZDO>) {
  const translate = useContext(TranslationContext);
  const crafterName = zdo.strings.get(CRAFTER_NAME);
  if (crafterName == null) return null;
  const extraData = extractExtraData({ crafterName });
  if (extraData == null) return null;
  return <List separator="">{
    Object.entries(extraData.effects).map(([key, val], i) =>
      <React.Fragment key={key}>
        <dt>{extraData.augmentedIndex === i ? <em>augmented</em> : null}</dt>
        <dd>{translate(`ui.mod.EpicLoot.effect.${key}`, val!)}</dd>
      </React.Fragment>)
  }</List>;
};
