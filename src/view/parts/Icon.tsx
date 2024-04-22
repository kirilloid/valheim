import React, { useContext } from 'react';
import { assertNever } from '../../model/utils';
import { TranslationContext, useGlobalState } from '../../effects';

import type { EntityId, GameObject } from '../../types';
import { effects } from '../../data/effects';

type IconType = 'armor' | 'arrow' | 'creature' | 'weapon' | 'piece' | 'skills' | 'resource' | 'icon' | 'transport' | 'object';

const iconType = (type: GameObject['type']): IconType => {
  switch (type) {
    case 'armor':
    case 'creature':
    case 'piece':
      return type;
    case 'fish':
    case 'spawner':
      return 'creature';
    case 'structure':
      return 'piece';
    case 'weapon':
    case 'tool':
    case 'shield':
    case 'bomb':
      return 'weapon';
    case 'arrow':
    case 'bolt':
    case 'missile':
      return 'arrow';
    case 'item':
    case 'trophy':
      return 'resource';
    case 'object':
      return 'object';
    case 'ship':
    case 'cart':
    case 'siege':
      return 'transport';
    default: return assertNever(type);
  }
};

export const iconPath = (item: GameObject): string => {
  if (item.iconId != null) return `/icons/${item.iconId}`;
  if (item.mod != null) return `/icons/${item.mod}/${item.id}`;
  return `/icons/${iconType(item.type)}/${item.id}`;
};

type SkillIconProps = {
  skill?: string;
  useAlt: boolean;
  size?: number;
}

export function SkillIcon(props: SkillIconProps) {
  const translate = useContext(TranslationContext);
  const { skill, useAlt, size = 32 } = props;
  return skill ? <img
    className="icon"
    src={`/icons/skills/${skill}.png`}
    alt={useAlt ? translate(`ui.skillType.${skill}`) : ''}
    title={useAlt ? translate(`ui.skillType.${skill}`) : ''}
    width={size}
    height={size}
  /> : <img
    className="icon"
    src={`/icons/nostroke.png`}
    alt="Unknown skill"
    title="Unknown skill"
    width={size}
    height={size}
  />;
}

type ItemIconProps = {
  item: GameObject | undefined;
  variant?: number;
  useAlt?: boolean;
  size?: number;
  className?: string;
}

export function EffectIcon(props: { id: EntityId; size?: number }) {
  const { id, size = 32 } = props;
  const iconId = effects.find(e => e.id === id)?.iconId;
  const path = iconId ? `/icons/${iconId}` : `/icons/effect/${id}`;
  return <picture>
    <source srcSet={`${path}.webp`} type="image/webp" />
    <img className="icon" src={`${path}.png`} width={size} height={size} alt="" />
  </picture>;
}

export function ItemIcon(props: ItemIconProps) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const { item, useAlt, size = 32, variant } = props;
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
  const { id } = item;
  if (item.tier > spoiler) {
    return <img
      className="icon"
      src="/icons/icon/hammer_spinner.png"
      alt="loading"
      width={size}
      height={size}
    />
  }
  const path = iconPath(item) + ((item as any).variants > 0 && variant != null ? variant : '');
  return <picture>
    <source srcSet={`${path}.webp`} type="image/webp" />
    <img
      className={'icon ' + (props.className ?? '')}
      src={`${path}.png`}
      alt={useAlt ? translate(id) : ''}
      title={useAlt ? translate(id) : ''}
      width={size}
      height={size}
      loading="lazy"
    />
  </picture>;
}

type IconProps =
( { id: string; } | { path: string } )
& { alt: string; size?: number; style?: React.CSSProperties }

export function Icon(props: IconProps) {
  const { alt, size = 32 } = props;
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

export function CopyIcon({ size }: { size: number }) {
  return <svg viewBox='0 0 16 16' width={size} style={{ verticalAlign: 'top' }}>
    <defs>
      <clipPath id="back">
        <rect x="4" y="2" width="8" height="2" />
        <rect x="10" y="4" width="2" height="9" />
      </clipPath>
    </defs>
    <rect x="3" width="6" y="5" height="8" rx="1" style={{ stroke: 'currentColor', fill: 'none' }} />
    <rect x="5" width="6" y="3" height="8" rx="1" style={{ stroke: 'currentColor', fill: 'none' }} clipPath="url(#back)" />
  </svg>
}
