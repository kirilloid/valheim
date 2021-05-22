import React from 'react';
import { SkillType } from '../model/skills';
import { assertNever } from '../model/utils';

import type { Item, Creature, EntityId, Piece, GameObject } from '../types';

type IconType = 'armor' | 'arrow' | 'creature' | 'weapon' | 'piece' | 'skills' | 'resource' | 'icon';

const iconType = (type: GameObject['type']): IconType => {
  switch (type) {
    case 'armor':
    case 'creature':
    case 'piece':
      return type;
    case 'weapon':
    case 'tool':
    case 'shield':
      return 'weapon';
    case 'ammo':
      return 'arrow';
    case 'item':
    case 'value':
    case 'food':
    case 'trophy':
    case 'potion':
      return 'resource';
    default: return assertNever(type);
  }
};


type SkillIconProps = {
  skill: SkillType;
  size?: number;
}

export function SkillIcon(props: SkillIconProps) {
  const { skill, size = 32 } = props;
  return <img
    className="icon"
    src={`/icons/skills/${SkillType[skill]}.png`}
    width={size}
    height={size}
  />;
}

type ItemIconProps = {
  item?: GameObject;
  size?: number;
}

export function ItemIcon(props: ItemIconProps) {
  const { item, size = 32 } = props;
  if (item === undefined) {
    return <img
      className="icon"
      src={`/icons/nostroke.png`}
      width={size}
      height={size}
    />;
  }
  const { type, id } = item;
  return <img
    key={id}
    className="icon"
    src={`/icons/${iconType(type)}/${id}.png`}
    alt={id}
    width={size}
    height={size}
  />;
}

type IconProps =
( { id: string; } | { path: string } )
& { size?: number; }

export function Icon(props: IconProps) {
  const { size = 32 } = props;
  if ('id' in props) {
    const { id } = props;
    return <img key={id} className="icon" src={`/icons/icon/${id}.png`} alt={id} width={size} height={size} />;
  }
  const { path } = props;
  return <img key={path} className="icon" src={`/icons/${path}.png`} alt={path} width={size} height={size} />;
}
