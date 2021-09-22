import React, { useContext } from 'react';
import { SkillType } from '../model/skills';
import { assertNever } from '../model/utils';
import { TranslationContext, useGlobalState } from '../effects';

import type { GameObject } from '../types';

type IconType = 'armor' | 'arrow' | 'creature' | 'weapon' | 'piece' | 'skills' | 'resource' | 'icon' | 'transport';

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
    case 'valuable':
    case 'food':
    case 'trophy':
    case 'potion':
    case 'plant':
    case 'destructible': // not really
    case 'treasure': // not really
      return 'resource';
    case 'ship':
    case 'cart':
      return 'transport';
    default: return assertNever(type);
  }
};


type SkillIconProps = {
  skill: SkillType;
  useAlt: boolean;
  size?: number;
}

export function SkillIcon(props: SkillIconProps) {
  const translate = useContext(TranslationContext);
  const { skill, useAlt, size = 32 } = props;
  const skillStr = SkillType[skill];
  return <img
    className="icon"
    src={`/icons/skills/${skillStr}.png`}
    alt={useAlt ? translate(`ui.skillType.${skillStr}`) : ''}
    title={useAlt ? translate(`ui.skillType.${skillStr}`) : ''}
    width={size}
    height={size}
  />;
}

type ItemIconProps = {
  item: GameObject | undefined;
  useAlt?: boolean;
  size?: number;
  className?: string;
}

export function ItemIcon(props: ItemIconProps) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const { item, useAlt, size = 32 } = props;
  if (item === undefined) {
    return <img
      className={'icon ' + (props.className ?? '')}
      src={`/icons/nostroke.png`}
      alt="not found"
      title="not found"
      width={size}
      height={size}
    />;
  }
  const { type, id } = item;
  const path = `/icons/${iconType(type)}/${id}`;
  if (item.tier > spoiler) {
    return <img
      className="icon"
      src="/icons/icon/hammer_spinner.png"
      alt="loading"
      width={size}
      height={size}
    />
  }
  return <picture key={id}>
    <source srcSet={`${path}.webp`} type="image/webp" />
    <img
      className={'icon ' + (props.className ?? '')}
      src={`${path}.png`}
      alt={useAlt ? translate(id) : ''}
      title={useAlt ? translate(id) : ''}
      width={size}
      height={size}
    />
  </picture>;
}

type IconProps =
( { id: string; } | { path: string } )
& { alt: string; size?: number; style?: React.CSSProperties }

export function Icon(props: IconProps) {
  const { alt = "", size = 32 } = props;
  if ('id' in props) {
    const { id } = props;
    return (
      <picture key={id}>
        <source srcSet={`/icons/icon/${id}_${size}.png, /icons/icon/${id}_${size*2}.png 2x`} />
        <img className="icon" src={`/icons/icon/${id}_${size}.png`} alt={alt} title={alt} width={size} height={size} style={props.style} />
      </picture>
    );
  }
  const { path } = props;
  return <img
    key={path}
    className="icon"
    src={`/icons/${path}.png`}
    alt={alt}
    width={size}
    height={size} />;
}
