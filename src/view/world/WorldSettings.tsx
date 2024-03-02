import React, { ReactNode, useCallback, useContext } from 'react';

import type { KeysOfType } from '../../types';
import type { ValueProps } from '../parts/types';
import type { WorldMeta } from './types';
import type { GameSettings } from '../../types/GameSettings';

import { TranslationContext } from '../../effects';
import { gameSettings, presets } from '../../data/game-settings';
import { List } from '../helpers';

const worldLevelEnemyLevelUpExponent = 1.15;

const _levelUp = (keys: Partial<GameSettings>, f = 10) => {
  const {
    worldlevel = gameSettings.worldlevel,
    enemyleveluprate = gameSettings.enemyleveluprate,
  } = keys
  return worldlevel > 0 && worldLevelEnemyLevelUpExponent > 0
    ? Math.min(70, Math.pow(f, worldlevel * worldLevelEnemyLevelUpExponent))
    : f * enemyleveluprate;
};

const DEFAULT_LEVEL_UP_PERCENT = 10;

const fmtPercent = (p: number) => `${(p * 100).toFixed(1)}%`;

const enemyleveluprateRenderer = (val: number) => {
  const chance = (val / 100) * (DEFAULT_LEVEL_UP_PERCENT / 100);
  const zero = 1 - chance;
  const one = zero * chance;
  const two = 1 - zero - one;
  return `${val}%: ⭐${fmtPercent(one)} | ⭐⭐${fmtPercent(two)}`;
}

function BoolInput<K extends KeysOfType<GameSettings, boolean>>({ keys, prop, onChange, disabled }: {
  keys: Partial<GameSettings>;
  prop: K;
  onChange: (prop: K, value: boolean) => void;
  disabled?: boolean;
}) {
  return <>
    <input type="checkbox"
      disabled={disabled}
      checked={keys[prop]}
      onChange={e => onChange(prop, e.target.checked)} />
  </>
}

function NumInput<K extends KeysOfType<GameSettings, number>>({
  keys, prop, onChange,
  min = 50,
  max = 200,
  renderer = (value) => `${value}%`,
  disabled = false,
}: {
  keys: Partial<GameSettings>;
  prop: K;
  onChange: (key: K, value: number) => void;
  min?: number;
  max?: number;
  renderer?: (value: number) => ReactNode;
  disabled?: boolean;
}) {
  const value = keys[prop] ?? gameSettings[prop];

  return <>
    <input type="range"
      className="range"
      min={min} max={max}
      disabled={disabled}
      value={value}
      onChange={e => onChange(prop, Number(e.target.value))} />
    {' '}
    {renderer(value)}
  </>
}

function OptionsInput<K extends KeysOfType<GameSettings, boolean>>({ keys, name, props, onChangeKeys }: {
  keys: Partial<GameSettings>;
  name: string;
  props: (K | '')[];
  onChangeKeys: (keys: Partial<GameSettings>) => void;
}) {
  const allProps = props.filter<K>((p: K | ""): p is K => p !== '');
  const rec = Object.fromEntries(allProps.map(p => [p, false])) as Partial<GameSettings>;
  return <List separator=" | ">
    {props.map(prop => 
      <label>
        <input type="radio" name={name}
          checked={prop === '' ? allProps.every(p => !keys[p]) : keys[prop]}
          onChange={e => prop === ''
            ? onChangeKeys(rec)
            : onChangeKeys({ ...rec, [prop]: e.target.checked })} />
          {' '}
          {prop || 'Normal'}
      </label>
    )}
  </List>
}


export function BasicWorldSettings({ value, onChange }: ValueProps<WorldMeta>) {
  const translate = useContext(TranslationContext);

  const setKeys = useCallback((keys: Partial<GameSettings>) => {
    onChange({ ...value, keys });
  }, [value, onChange]);

  const onChangeKey = <K extends keyof GameSettings>(key: K, val: GameSettings[K]) => {
    onChange({ ...value, keys: { ...value.keys, [key]: val } });
  };
  
  const onChangeKeys = (keys: Partial<GameSettings>) => {
    onChange({ ...value, keys: { ...value.keys, ...keys } });
  };
  
  const setPreset = (preset: keyof typeof presets) => {
    setKeys(presets[preset]);
  }

  const { keys } = value;

  return <div>
    <h3>{translate("ui.serverOptions.presets")}</h3>
    <div>
      <button onClick={() => setPreset('easy')}>{translate("ui.serverOptions.easy")}</button>
      <button onClick={() => setPreset('hard')}>{translate("ui.serverOptions.hard")}</button>
      <button onClick={() => setPreset('hardcore')}>{translate("ui.serverOptions.hardcore")}</button>
      <button onClick={() => setPreset('casual')}>{translate("ui.serverOptions.casual")}</button>
      <button onClick={() => setPreset('hammer')}>{translate("ui.serverOptions.hammer")}</button>
      <button onClick={() => setPreset('immersive')}>{translate("ui.serverOptions.immersive")}</button>
    </div>
    <button onClick={() => setKeys({})}>{translate("ui.serverOptions.default")}</button>
    <h3>{translate("ui.serverOptions.customize")}</h3>
    <h4>{translate("ui.serverOptions.combat")}</h4>
    <dl>
      <dt>Player damage</dt>
      <dd><NumInput keys={keys} prop="playerdamage" onChange={onChangeKey} /></dd>
      <dt>Enemy damage</dt>
      <dd><NumInput keys={keys} prop="enemydamage" onChange={onChangeKey} /></dd>
      <dt>Enemy speed</dt>
      <dd><NumInput keys={keys} prop="enemyspeedsize" onChange={onChangeKey} /></dd>
      <dt>Enemy level up</dt>
      <dd><NumInput keys={keys} prop="enemyleveluprate" onChange={onChangeKey}
        renderer={enemyleveluprateRenderer}/></dd>
    </dl>
    <h4>{translate("ui.serverOptions.deathPenalty")}</h4>
    <dl>
      <dt>No skill loss</dt>
      <dd><BoolInput keys={keys} prop="deathnoskillslost" onChange={onChangeKey} /></dd>
      <dt>Skill reduction rate</dt>
      <dd><NumInput keys={keys} prop="skillreductionrate" onChange={onChangeKey} min={0} disabled={keys.deathskillsreset} /></dd>
      <dt>Equip</dt>
      <dd>
        <OptionsInput keys={keys} props={['deathkeepequip', '', 'deathdeleteunequipped', 'deathdeleteitems']} onChangeKeys={onChangeKeys} name="death-equip" />
      </dd>
    </dl>
    <h4>Others</h4>
    <dl>
      <dt>{translate("ui.serverOptions.resources")}</dt>
      <dd><NumInput keys={keys} prop="resourcerate" onChange={onChangeKey} /></dd>
      <dt>{translate("ui.serverOptions.events")}</dt>
      <dd><NumInput keys={keys} prop="eventrate" onChange={onChangeKey} /></dd>
      <dt>{translate("ui.serverOptions.portals")}</dt>
      <dd><OptionsInput keys={keys} props={['teleportall', '', 'nobossportals', 'noportals']} onChangeKeys={onChangeKeys} name="portals" /></dd>
    </dl>
  </div>
}
