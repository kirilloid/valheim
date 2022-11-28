import React, { useContext, useState } from 'react';

import type { PlayerData } from './types';
import type { ValueProps } from '../parts/types';

import { TranslationContext } from '../../effects';
import { HDColor, hdColorDatalist } from '../ColorEditor';
import { lerp, lerpStep, Vector3 } from '../../model/utils';
import { Tabs } from '../parts/Tabs';

const MODELS = ['male', 'female'];
const beards = ['Beard1', 'Beard2', 'Beard3', 'Beard4', 'Beard5', 'Beard6', 'Beard7', 'Beard8', 'Beard9', 'Beard10', 'Beard11', 'Beard12', 'Beard13', 'Beard14', 'Beard15', 'Beard16', 'BeardNone'];
const hairs = ['Hair1', 'Hair2', 'Hair3', 'Hair4', 'Hair5', 'Hair6', 'Hair7', 'Hair8', 'Hair9', 'Hair10', 'Hair11', 'Hair12', 'Hair13', 'Hair14', 'Hair15', 'Hair16', 'Hair17', 'Hair18', 'Hair19', 'Hair20', 'Hair21', 'Hair22', 'Hair23', 'HairNone'];

const HAIR_COLOR_0: Vector3 = { x: 1, y: 0.9310345, z: 0.7058823 };
const HAIR_COLOR_1: Vector3 = { x: 1, y: 0.48813385, z: 0.2794118 };

function SkinColor({ value, onChange } : ValueProps<Vector3>) {
  return <>
    <input type="range" value={value.x} min="0.3" max="1" step="0.001" onChange={e => {
      const v = Number(e.target.value);
      onChange({ x: v, y: v, z: v });
    }} />
  </>;
}

function hairColorFromRgb(value: Vector3) {
  const darkness = value.x;
  const hue = (lerpStep(HAIR_COLOR_0.y, HAIR_COLOR_1.y, value.y / value.x)
            +  lerpStep(HAIR_COLOR_0.z, HAIR_COLOR_1.z, value.z / value.x)) / 2;
  return { darkness, hue };
}

function hairColorToRgb(darkness: number, hue: number) {
  const x = darkness;
  const y = lerp(HAIR_COLOR_0.y, HAIR_COLOR_1.y, hue) * x;
  const z = lerp(HAIR_COLOR_0.z, HAIR_COLOR_1.z, hue) * x;
  return { x, y, z };
}

function HairColor({ value, onChange } : ValueProps<Vector3>) {
  const { darkness, hue } = hairColorFromRgb(value);
  return <>
    <input type="range" min="0.1" max="1" step="0.001" value={darkness} onChange={e => {
      const d = Number(e.target.value);
      onChange(hairColorToRgb(d, hue));
    }} style={{ height: 8 }} />
    <br />
    <input type="range" value={hue} min="0" max="1" step="0.001" onChange={e => {
      const h = Number(e.target.value);
      onChange(hairColorToRgb(darkness, h));
    }} />
  </>;
}

function htmlColor({ x, y, z }: Vector3): string {
  return `rgb(${x * 255}, ${y * 255}, ${z * 255})`
}

function BasicColors({ value, onChange } : ValueProps<PlayerData>) {
  const translate = useContext(TranslationContext);
  return <dl>
    <dt>
      <div className="HDColor__color" style={{ display: 'inline-block', float: 'right', marginRight: 8, backgroundColor: htmlColor(value.skinColor), }} />
      {translate('char.skinColor')}
      {/* {translate('char.glow')} <input type="checkbox" disabled checked={value.skinColor.x > 1 || value.skinColor.y > 1 || value.skinColor.z > 1} /> */}
    </dt>
    <dd>
      <SkinColor value={value.skinColor} onChange={skinColor => onChange({ ...value, skinColor })} />
    </dd>
    <dt>
      <div className="HDColor__color" style={{ display: 'inline-block', float: 'right', marginRight: 8, marginTop: 16, backgroundColor: htmlColor(value.hairColor) }} />
      {translate('char.hairColor')}<br />
      blondness
    </dt>
    <dd>
      <HairColor value={value.hairColor} onChange={hairColor => onChange({ ...value, hairColor })} />
    </dd>
  </dl>
}

const presets = [
  { name: 'celestial', color: { x: 5, y: 5, z: 5 } },
  { name: 'draugr', color: { x: 0.25, y: 0.5, z: 0.25 } },
  { name: 'hellboy', color: { x: 1, y: 0, z: 0 } },
  { name: 'onyx', color: { x: 0, y: 0, z: 0 } },
  { name: 'radioactive zombie', color: { x: 0, y: 5, z: 0 } },
  { name: 'surtling', color: { x: 5, y: 3, z: 0.25 } },
  { name: 'troll', color: { x: 0.1, y: 0.667, z: 1 } },
  { name: 'ultraviolet', color: { x: 0, y: 1, z: 5 } },
];

function ColorPreset({ value, onChange } : ValueProps<Vector3>) {
  const preset = presets.find(p => p.color === value);
  return <select value={preset?.name ?? ''} onChange={(e) => {
    const newPreset = presets.find(p => p.name === e.target.value);
    if (newPreset != null) onChange(newPreset.color);
  }}>
    <option value="">&mdash;</option>
    {presets.map(p => <option value={p.name} key={p.name}>{p.name}</option>)}
  </select>
}

function AdvancedColors({ value, onChange } : ValueProps<PlayerData>) {
  const translate = useContext(TranslationContext);
  return <div>
    {hdColorDatalist}
    <div className="info">In order to see glowing colors "Bloom" should be enabled in graphic settings</div>
    <div style={{ float: 'right', position: 'relative', zIndex: 1 }}>
      <ColorPreset value={value.skinColor} onChange={skinColor => onChange({ ...value, skinColor })} />
    </div>

    <h3>
      {translate('char.skinColor')}
    </h3>
    <HDColor value={value.skinColor} onChange={skinColor => onChange({ ...value, skinColor })} />
    <h3>{translate('char.hairColor')}</h3>
    <HDColor value={value.hairColor} onChange={hairColor => onChange({ ...value, hairColor })} />
  </div>
}

function isComplexSkinColor(color: Vector3): boolean {
  return color.x !== color.y
      || color.x !== color.z;
}

function isComplexHairColor(color: Vector3): boolean {
  const { darkness, hue } = hairColorFromRgb(color);
  const reSavedColor = hairColorToRgb(darkness, hue);
  return Math.abs(color.x - reSavedColor.x) > 0.01
      || Math.abs(color.y - reSavedColor.y) > 0.01
      || Math.abs(color.z - reSavedColor.z) > 0.01;
}

export function Appearance({ value, onChange, name, onNameChange } : ValueProps<PlayerData> & {
  name: string;
  onNameChange: (name: string) => void; 
}) {
  const translate = useContext(TranslationContext);
  const colorTabs = [
    {
      title: 'Basic',
      renderer: () => <BasicColors value={value} onChange={onChange} />,
    },
    {
      title: 'Advanced',
      renderer: () => <AdvancedColors value={value} onChange={onChange} />,
    },
  ];

  const [nameEditing, setNameEditing] = useState<undefined | string>(undefined);
  const isComplexColor = isComplexSkinColor(value.skinColor) || isComplexHairColor(value.hairColor)

  return <>
    <dl>
      <dt>{translate('char.name')}</dt>
      <dd>{
        nameEditing == null
        ? <>{name} <button className="btn btn--sm" onClick={() => setNameEditing(name)}>Edit</button></>
        : <>
            <input value={nameEditing} onChange={e => setNameEditing(e.target.value)} />
            {' '}
            <button className="btn btn--sm" onClick={() => onNameChange(nameEditing)} disabled={!nameEditing}>Save</button>
            {' '}
            <button className="btn btn--sm" onClick={() => setNameEditing(undefined)}>Cancel</button>
          </>}
      </dd>
      <dt>{translate('char.sex')}</dt>
      <dd>
        <select value={value.modelIndex}
          onChange={e => onChange({ ...value, modelIndex: +e.target.value })}>
          {MODELS.map((name, index) =>
            <option key={name} value={index}>{translate(`char.sex.${MODELS[index]}`)}</option>
          )}
        </select>
      </dd>
      {value.modelIndex === 0 && <>
        <dt>{translate('char.beard')}</dt>
        <dd>
          <select value={value.beardItem}
            onChange={e => onChange({ ...value, beardItem: e.target.value })}>
            <option value="">—</option>
            {beards.map(id =>
              <option key={id} value={id}> {translate(`char.beard.${id}`)} </option>
            )}
          </select>
        </dd>
      </>}
      <dt>{translate('char.hair')}</dt>
      <dd>
        <select value={value.hairItem}
          onChange={e => onChange({ ...value, hairItem: e.target.value })}>
          <option value="">—</option>
          {hairs.map(id =>
            <option key={id} value={id}> {translate(`char.hair.${id}`)} </option>
          )}
        </select>
      </dd>
    </dl>
    <Tabs tabs={colorTabs} selected={isComplexColor ? 1 : 0} />
  </>
}
