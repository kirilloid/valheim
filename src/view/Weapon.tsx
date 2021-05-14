import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import {
  DamageProfile,
  DamageType,
  Weapon as TWeapon,
  Attack as TAttack,
} from '../types';
import { SkillType } from '../model/skills';
import { Icon } from './Icon';
import { RecipeSection } from './Source';
import { durability, ItemSpecial, showPair } from './helpers';
import { TranslationContext, useTranslation } from '../translation.effect';

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

function ShieldStats(props: { item: TWeapon, level?: number }) {
  const translate = useContext(TranslationContext);
  const { item, level } = props;
  return <section>
    <header>{translate('ui.itemType.shield')}</header>
    <dl>
      <dt>block</dt><dd><Icon type="icon" id="ac_bkg" size={16} />{' '}{showPair(item.block, level)}</dd>
      <dt>{translate('ui.skill')}</dt><dd>{skill(item.skill)}</dd>
      <dt>parry</dt><dd>{item.parryBonus}x</dd>
      <dt>{translate('ui.hands')}</dt><dd>{translate(`ui.slot.${item.slot}`)}</dd>
      <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">{translate('ui.durability')}</dt><dd>{durability(item.durability, level)}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
    </dl>
  </section>;
}

function WeaponStats({ item, level }: { item: TWeapon, level?: number }) {
  const translate = useContext(TranslationContext);
  const baseDmg = totalDamage(item.damage[0]);
  const lvlDmg = totalDamage(item.damage[1]);
  return <section>
    <header>{translate('ui.itemType.weapon')}</header>
    <dl>
      <dt>{translate('ui.damage')}</dt><dd>{showPair([baseDmg, lvlDmg], level)}</dd>
      <dt>{translate('ui.skill')}</dt><dd>{skill(item.skill)}</dd>
      <dt><Link to="/info/combat#backstab">backstab</Link></dt><dd>{item.backstab}x</dd>
      <dt>{translate('ui.hands')}</dt><dd>{translate(`ui.slot.${item.slot}`)}</dd>
      <dt>{translate('ui.maxQuality')}</dt><dd><Icon type="icon" id="craft_icon" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">{translate('ui.durability')}</dt>
      <dd>{durability(item.durability, level)}{item.durabilityDrainPerSec ? ` -1 / ${item.durabilityDrainPerSec}s of usage` : ""}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">move speed</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
      <dt>knockback</dt><dd>{item.knockback}</dd>
      <ItemSpecial special={item.special} />
    </dl>
  </section>
}

function Attack({ item, attack }: { item: TWeapon, attack: TAttack }) {
  const translate = useTranslation();
  const { damage = 1, force = 1, stagger = 1 } = attack.mul ?? {};
  const projVel = attack.type === 'proj' ? attack.projVel[1] : undefined;
  const projAcc = attack.type === 'proj' ? attack.projAcc[1] : undefined;
  return <dl>
    <dt>type</dt><dd>{attack.type}</dd>
    <dt>{translate('ui.stamina')}</dt><dd>{attack.stamina}</dd>
    {attack.type === 'proj' && <>
      <dt>velocity</dt><dd>{attack.projVel[0]}&ndash;{attack.projVel[1]}</dd>
      <dt>scatter</dt><dd>{attack.projAcc[0]}&ndash;{attack.projAcc[1]}&deg;</dd>
    </>}
    {projAcc != null && <><dt>velocity</dt><dd>{projVel}</dd></>}
    {damage !== 1 && <><dt>{translate('ui.damage')}</dt><dd>{damage}x</dd></>}
    {force !== 1 && <><dt>knockback</dt><dd>{item.knockback * force}</dd></>}
    {stagger !== 1 && <><dt>stagger</dt><dd>{stagger}x</dd></>}
  </dl>;
}

export function Weapon({ item, level }: { item: TWeapon, level?: number }) {
  const translate = useTranslation();
  const [primaryAttack, secondaryAttack] = item.attacks;
  return (
    <>
      <h2>
        <Icon type="weapon" id={item.id} />
        {' '}
        {translate(item.id)}
      </h2>
      {item.skill === SkillType.Blocking
        ? <ShieldStats item={item} level={level} />
        : <WeaponStats item={item} level={level} />
      }
      {primaryAttack && <section>
        <header>primary attack</header>
        <Attack item={item} attack={primaryAttack} />
      </section>}
      {secondaryAttack && <section>
        <header>secondary attack</header>
        <Attack item={item} attack={secondaryAttack} />
      </section>}
      <section>
        <header>{translate('ui.itemType.resource')}</header>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon type="icon" id="weight" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{item.floating ? '✔️' : '❌'}</dd>
        </dl>
      </section>
      <RecipeSection item={item} />
    </>
  );
}