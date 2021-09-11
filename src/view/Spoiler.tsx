import React, { useContext } from 'react';
import { biomes } from '../data/location';
import { TranslationContext, useGlobalState } from '../effects';

export function SpoilerAlert({ tier }: { tier: number }) {
  const translate = useContext(TranslationContext);
  const [spoiler, setSpoiler] = useGlobalState('spoiler');
  const biome = biomes.find(b => b.tier === tier)?.id;
  const biomeName = biome ? translate(`ui.biome.${biome}`) : 'further biomes';
  return tier > spoiler
    ? <div className="SpoilerAlert">
        <div className="SpoilerAlert__curtain"></div>
        <div className="SpoilerAlert__message Dialog">
          <div className="SpoilerAlert__header Dialog__header">SPOILER ALERT</div>
          <div className="Dialog__body">
            This page contain spoilers because it has content beyond your currently tracked progression.<br />
            Do you want to see content from <b>{biomeName}</b>?
          </div>
          <div className="Dialog__buttons">
            <input className="Dialog__button btn" type="button" disabled value="Once" onClick={() => {
              
            }} />
            <input className="Dialog__button btn" type="button" value="Always" onClick={() => {
              setSpoiler(tier);
            }} />
            <input className="Dialog__button btn" type="button" value="No spoiler alerts" onClick={() => {
              setSpoiler(999);
            }} />
          </div>
        </div>
      </div>
    : null
}