import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import {
  DamageProfile,
  Weapon as TWeapon,
  Shield as TShield,
  Attack as TAttack,
} from '../../types';
import { SkillType } from '../../model/skills';
import { TranslationContext } from '../../effects';

import { durability, ItemSpecial, showPair, yesNo } from '../helpers';
import { Icon, SkillIcon } from '../parts/Icon';
import { RecipeSection } from '../parts/Source';
import { ItemHeader } from '../parts/ItemHeader';

function skill(skill: SkillType | null) {
  const str = skill && SkillType[skill];
  return skill != null && str != null
    ? <>
        <SkillIcon skill={skill} useAlt={false} size={16} />
        {' '}
        {str}
      </>
    : null;
}

function totalDamage(damage: DamageProfile): number {
  return Object
    .entries(damage)
    .filter(([key]) => key !== 'chop' && key !== 'pickaxe')
    .reduce<number>((a, [_, b]) => a + b!, 0);
}

function ShieldStats(props: { item: TShield, level?: number }) {
  const translate = useContext(TranslationContext);
  const { item, level } = props;
  return <section>
    <h2>{translate('ui.itemType.shield')}</h2>
    <dl>
      <dt>{translate('ui.skill')}</dt><dd>{skill(item.skill) ?? <em>{translate('ui.skillType.None')}</em>}</dd>
      <dt>{translate('ui.block')}</dt><dd><Icon id="armor" alt="" size={16} />{' '}{showPair(item.block, level)}</dd>
      <dt>{translate('ui.parryBonus')}</dt><dd>{item.parryBonus}×</dd>
      <dt>{translate('ui.hands')}</dt><dd>{translate(`ui.slot.${item.slot}`)}</dd>
      <dt>{translate('ui.maxQuality')}</dt><dd><Icon id="star" alt="crafting" size={16} />{' '}{item.maxLvl}</dd>
      <dt title="weapons loose 1 durability point per hit">{translate('ui.durability')}</dt><dd>{durability(item.durability, level)}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">{translate('ui.moveSpeed')}</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
    </dl>
  </section>;
}

function WeaponStats({ item, level }: { item: TWeapon, level?: number }) {
  const translate = useContext(TranslationContext);
  const baseDmg = totalDamage(item.damage[0]);
  const lvlDmg = totalDamage(item.damage[1]);
  return <section>
    <h2>{translate('ui.itemType.weapon')}</h2>
    <dl>
      <dt>{translate('ui.skill')}</dt><dd>{skill(item.skill) ?? <em>{translate('ui.skillType.None')}</em>}</dd>
      <dt>{translate('ui.damage')}</dt><dd>{showPair([baseDmg, lvlDmg], level)}</dd>
      <dt>{translate('ui.backstab')} <Link to="/info/combat#backstab">ℹ️</Link></dt><dd>{item.backstab}×</dd>
      <dt>{translate('ui.hands')}</dt><dd>{translate(`ui.slot.${item.slot}`)}</dd>
      <dt>{translate('ui.maxQuality')}</dt><dd><Icon id="star" alt="" size={16} />{' '}{item.maxLvl}</dd>
      <dt>{translate('ui.block')}</dt><dd>{showPair(item.block, level)}</dd>
      <dt>{translate('ui.parryBonus')}</dt><dd>{item.parryBonus}×</dd>
      <dt title="weapons loose 1 durability point per hit">{translate('ui.durability')}</dt>
      <dd>{durability(item.durability, level)}{item.durabilityDrainPerSec ? ` -1 / ${item.durabilityDrainPerSec}s of usage` : ""}</dd>
      {item.moveSpeed ? <><dt title="when equipped and drawn">{translate('ui.moveSpeed')}</dt><dd>{item.moveSpeed * 100}%</dd></> : null}
      <dt>{translate('ui.knockback')}</dt><dd>{item.knockback}</dd>
      <ItemSpecial special={item.special} />
    </dl>
  </section>
}

function Attack({ item, attack }: { item: TWeapon, attack: TAttack }) {
  const translate = useContext(TranslationContext);
  const { damage = 1, force = 1, stagger = 1 } = attack.mul ?? {};
  return <dl>
    <dt>{translate('ui.attackType')}</dt>
    <dd>{translate(`ui.attackType.${attack.type}`)}</dd>
    <dt>{translate('ui.stamina')}</dt>
    <dd>{attack.stamina}</dd>
    <dt>{translate('ui.moveSpeed')}</dt>
    <dd>{
      attack.walkSpeed === attack.rotationSpeed
        ? attack.walkSpeed
        : `${attack.walkSpeed} / ${attack.rotationSpeed}`
    }</dd>
    <dt>noise</dt>
    <dd>{attack.startNoise} / {attack.hitNoise}</dd>
    {attack.type === 'melee' && attack.chain > 0 && <>
      <dt>{translate('ui.attackMelee.combo')}</dt>
      <dd>{attack.chain}</dd>
    </>}
    {attack.type === 'proj' && <>
      <dt>{translate('ui.attackRanged.velocity')}</dt>
      <dd>{attack.projVel[1]}</dd>
      <dt>{translate('ui.attackRanged.scatter')}</dt>
      <dd>{attack.projAcc[1]}&deg;</dd>
    </>}
    {damage !== 1 && <><dt>{translate('ui.damage')}</dt><dd>{damage}×</dd></>}
    {force !== 1 && <><dt>{translate('ui.knockback')}</dt><dd>{force}×</dd></>}
    {stagger !== 1 && <><dt>{translate('ui.stagger')}</dt><dd>{stagger}×</dd></>}
  </dl>;
}

export function Weapon({ item, level }: { item: TWeapon, level?: number }) {
  const translate = useContext(TranslationContext);
  const [primaryAttack, secondaryAttack] = item.attacks;
  return (
    <>
      <ItemHeader item={item} />
      <WeaponStats item={item} level={level} />
      {primaryAttack && <section>
        <h2>{translate('ui.attack.primary')}</h2>
        <Attack item={item} attack={primaryAttack} />
      </section>}
      {secondaryAttack && <section>
        <h2>{translate('ui.attack.secondary')}</h2>
        <Attack item={item} attack={secondaryAttack} />
      </section>}
      <hr />
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        </dl>
      </section>
      <RecipeSection item={item} />
    </>
  );
}

export function Shield({ item, level }: { item: TShield, level?: number }) {
  const translate = useContext(TranslationContext);
  return (
    <>
      <ItemHeader item={item} />
      <ShieldStats item={item} level={level} />
      <section>
        <h2>{translate('ui.itemType.resource')}</h2>
        <dl>
          <dt>{translate('ui.weight')}</dt><dd><Icon id="weight" alt="" size={16} />{' '}{item.weight}</dd>
          <dt>{translate('ui.floats')}</dt><dd>{yesNo(item.floating)}</dd>
        </dl>
      </section>
      <RecipeSection item={item} />
    </>
  );
}
