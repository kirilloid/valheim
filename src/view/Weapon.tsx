import React from 'react';
import { Link } from 'react-router-dom';

import { DamageProfile, DamageType, Weapon as TWeapon } from '../types';
import { assertNever } from '../model/utils';
import { SkillType } from '../model/skills';
import { Icon } from './Icon';
import { Recipe } from './Recipe';
import { durability } from './helpers';
import { useTranslation } from '../translation.effect';

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

function skill(skill: SkillType): string {
  switch (skill) {
    case SkillType.Swords:
      return 'Swords';
    case SkillType.Knives:
      return 'Knives';
    case SkillType.Clubs:
      return 'Clubs';
    case SkillType.Polearms:
      return 'Polearms';
    case SkillType.Spears:
      return 'Spears';
    case SkillType.Blocking:
      return 'Blocking';
    case SkillType.Axes:
      return 'Axes';
    case SkillType.Bows:
      return 'Bows';
    case SkillType.Unarmed:
      return 'Unarmed';
    case SkillType.Pickaxes:
      return 'Pickaxes';
    case SkillType.WoodCutting:
      return 'WoodCutting';
    case SkillType.Jump:
      return 'Jump';
    case SkillType.Sneak:
      return 'Sneak';
    case SkillType.Run:
      return 'Run';
    case SkillType.Swim:
      return 'Swim';
  }
}

function totalDamage(damage: DamageProfile): number {
  return Object
    .entries(damage)
    .filter(([key]) => key != String(DamageType.Chop) && key != String(DamageType.Pickaxe))
    .reduce<number>((a, [_, b]) => a + b!, 0);
}

function ShieldStats(item: TWeapon) {
  return <section>
    <header>shield</header>
    <dl>
      <dt>block</dt><dd><Icon type="icon" id="ac_bkg" size={16} />{' '} {([] as number[]).concat(item.block).join('+')}</dd>
      <dt>skill</dt><dd>{skill(item.skill)}</dd>
      <dt>parry</dt><dd>{item.parryBonus}x</dd>
      <dt>hands</dt><dd>{hand(item.slot)}</dd>
      <dt>max quality</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">durability</dt><dd>{durability(item.durability)}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
      <dt>weight</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
    </dl>
  </section>;
}

function WeaponStats(item: TWeapon) {
  const baseDmg = totalDamage(item.damage[0]);
  const lvlDmg = totalDamage(item.damage[1]);
  return <section>
    <header>weapon</header>
    <dl>
      <dt>damage</dt><dd>{baseDmg}+{lvlDmg}</dd>
      <dt>skill</dt><dd>{skill(item.skill)}</dd>
      <dt><Link to="/info/combat#backstab">backstab</Link></dt><dd>{item.backstab}x</dd>
      <dt>hands</dt><dd>{hand(item.slot)}</dd>
      <dt>max quality</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">durability</dt><dd>{durability(item.durability)}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
      <dt>knockback</dt><dd>{item.knockback}</dd>
      <dt>weight</dt><dd><Icon type="icon" id="weight_icon" size={16} />{' '}{item.weight}</dd>
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
        ? <ShieldStats {...item} />
        : <WeaponStats {...item} />
      }
      {recipe ? (<section>
        <header>recipe</header>
        <Recipe {...recipe} />
      </section>) : null}
    </>
  );
}