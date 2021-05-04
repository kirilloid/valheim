import React from 'react';
import { Link } from 'react-router-dom';

import { DamageProfile, DamageType, Weapon as TWeapon } from '../types';
import { assertNever } from '../model/utils';
import { SkillType } from '../model/skills';
import { Icon } from './Icon';
import { Recipe } from './Recipe';
import { durability } from './helpers';
import { Translator, useTranslation } from '../translation.effect';

function hand(slot: TWeapon['slot']): string | undefined {
  switch (slot) {
    case 'body':
    case 'shoulders':
    case 'legs':
    case 'head':
    case 'util':
    case 'none':
      return undefined;
    case 'both':
    case 'bow':
      return '2-hand';
    case 'either':
      return 'any hand';
    case 'primary':
      return 'right hand';
    case 'secondary':
      return 'left hand';
    default:
      return assertNever(slot);
  }
}

function skill(skill: SkillType) {
  const str = SkillType[skill];
  return str != null
    ? <>
        <Icon type="skills" id={str} size={16} />
        {' '}{str}
      </>
    : <em>none</em>;
}

function totalDamage(damage: DamageProfile): number {
  return Object
    .entries(damage)
    .filter(([key]) => key !== String(DamageType.Chop) && key !== String(DamageType.Pickaxe))
    .reduce<number>((a, [_, b]) => a + b!, 0);
}

function ShieldStats(props: { item: TWeapon, translate: Translator }) {
  const { item, translate } = props;
  return <section>
    <header>{translate('ui.itemType.shield')}</header>
    <dl>
      <dt>block</dt><dd><Icon type="icon" id="ac_bkg" size={16} />{' '} {([] as number[]).concat(item.block).join('+')}</dd>
      <dt>{translate('ui.skill')}</dt><dd>{skill(item.skill)}</dd>
      <dt>parry</dt><dd>{item.parryBonus}x</dd>
      <dt>hands</dt><dd>{hand(item.slot)}</dd>
      <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">{translate('ui.durability')}</dt><dd>{durability(item.durability)}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
      <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
    </dl>
  </section>;
}

function WeaponStats(props: { item: TWeapon, translate: Translator }) {
  const { item, translate } = props;
  const baseDmg = totalDamage(item.damage[0]);
  const lvlDmg = totalDamage(item.damage[1]);
  return <section>
    <header>{translate('ui.itemType.weapon')}</header>
    <dl>
      <dt>{translate('ui.damage')}</dt><dd>{baseDmg}+{lvlDmg}</dd>
      <dt>{translate('ui.skill')}</dt><dd>{skill(item.skill)}</dd>
      <dt><Link to="/info/combat#backstab">backstab</Link></dt><dd>{item.backstab}x</dd>
      <dt>hands</dt><dd>{hand(item.slot)}</dd>
      <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">{translate('ui.durability')}</dt><dd>{durability(item.durability)}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
      <dt>knockback</dt><dd>{item.knockback}</dd>
      <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
    </dl>
  </section>
}

export function Weapon(item: TWeapon) {
  const translate = useTranslation();
  const { recipe } = item;
  return (
    <>
      <h2>
        <Icon type="weapon" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      {item.skill === SkillType.Blocking
        ? <ShieldStats item={item} translate={translate} />
        : <WeaponStats item={item} translate={translate} />
      }
      {recipe ? (<section>
        <header>{translate('ui.recipe')}</header>
        <Recipe {...recipe} />
      </section>) : null}
    </>
  );
}