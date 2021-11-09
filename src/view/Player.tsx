import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import type { Item } from '../types';
import type { Vector3 } from '../model/utils';

import { read, Player as TPlayer, PlayerData, Inventory as TInventory, SkillData, MapData as TMapData, readMapData, write } from '../file/Player';

import { TranslationContext } from '../effects';
import { ItemIcon, SkillIcon } from './Icon';
import { data } from '../data/itemDB';
import { SkillType } from '../model/skills';

type ValueProps<T> = { value: T; onChange: (arg: T) => void };

function Stats({ stats } : { stats: TPlayer['stats'] }) {
  return <dl>
    <dt>kills (PvP)</dt><dd>{stats.kills}</dd>
    <dt>deaths (any)</dt><dd>{stats.deaths}</dd>
    <dt>items crafted</dt><dd>{stats.crafts}</dd>
    <dt>structures built</dt><dd>{stats.builds}</dd>
  </dl>
}

function Color({ value, onChange }: ValueProps<Vector3>) {
  const { x, y, z } = value;
  const color = '#' + [x, y, z].map(
    r => Math.round(r * 255)
      .toString(16)
      .padStart(2, '0')
  ).join('');
  return <input type="color" value={color} onChange={e => {
    const rgb = e.target.value.match(/[a-f0-9]{2}/g);
    if (!rgb) return;
    const [x, y, z] = rgb.map(v => parseInt(v, 16) / 255);
    onChange({ x: x!, y: y!, z: z! });
  }} />;
}

const MODELS = ['MALE', 'FEMALE'];
const beards = ['Beard1', 'Beard2', 'Beard3', 'Beard4', 'Beard5', 'Beard6', 'Beard7', 'Beard8', 'Beard9', 'Beard10', 'BeardNone'];
const hairs = ['Hair1', 'Hair2', 'Hair3', 'Hair4', 'Hair5', 'Hair6', 'Hair7', 'Hair8', 'Hair9', 'Hair10', 'Hair11', 'Hair12', 'Hair13', 'Hair14', 'HairNone'];

function Appearance({ value, onChange } : ValueProps<PlayerData>) {
  const translate = useContext(TranslationContext);
  return <dl>
    <dt>model</dt>
    <dd>{MODELS[value.modelIndex]}</dd>
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
    <dt>{translate('char.skinColor')}</dt>
    <dd><Color value={value.skinColor} onChange={skinColor => onChange({ ...value, skinColor })} /></dd>
    <dt>{translate('char.hairColor')}</dt>
    <dd><Color value={value.hairColor} onChange={hairColor => onChange({ ...value, hairColor })} /></dd>
  </dl>
}

const mapDataCache = new Map<BigInt, TMapData>();

function MapData({ mapData }: { mapData: TMapData }) {
  const SIZE = 512;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useLayoutEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx == null) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.strokeStyle = '#888';
    ctx.beginPath();
    ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2, true);
    ctx.stroke();
    const imageData = ctx.getImageData(0, 0, SIZE, SIZE);
    const { tileSize } = mapData;
    for (let y = 0; y < SIZE; y++) {
      for (let x = 0; x < SIZE; x++) {
        if ((x - SIZE / 2) ** 2 + (y - SIZE / 2) ** 2 > (SIZE / 2) ** 2) continue;
        const offset = (y * tileSize + x) * (tileSize / SIZE);
        const bitThey = (mapData.exploredOthers[offset >> 3]! >> (offset & 7)) & 1;
        const bitMe = (mapData.explored[offset >> 3]! >> (offset & 7)) & 1;
        imageData.data[(y * SIZE + x) * 4 + 3] += bitMe ? 255 : bitThey ? 128 : 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [mapData]);
  return <>
    {' '}
    map pins: {mapData.pins.length ?? '—'}
    <br/>
    <canvas ref={r => canvasRef.current = r} width={SIZE} height={SIZE} />
  </>
}

function Worlds({ value: worlds } : ValueProps<TPlayer['worlds']>) {
  const entries = [...worlds.entries()];
  const [hash, setHash] = useState(entries[0]?.[0] ?? BigInt(0));
  const [mapData, setMapData] = useState<TMapData>();
  useEffect(function drawMap() {
    const world = worlds.get(hash);
    if (mapDataCache.has(hash)) {
      setMapData(mapDataCache.get(hash));
      return;
    }
    const mapDataPacked = world?.mapData;
    if (mapDataPacked == null) return;
    const mapDataUnpacked = readMapData(mapDataPacked.buffer);
    mapDataCache.set(hash, mapDataUnpacked);
    setMapData(mapDataUnpacked);
  }, [worlds, hash])
  if (worlds.size === 0) {
    return <span>You character hasn't visited any worlds yet</span>
  }
  return <>
    <select value={hash.toString()} onChange={e => setHash(BigInt(e.target.value))}>
      {entries.map(e => <option value={e[0].toString()} key={e[0].toString()}>{e[0].toString(16)}</option>)}
    </select>
    {mapData && <MapData mapData={mapData} />}
  </>
}

function Inventory({ inventory } : { inventory: TInventory }) {
  return <div style={{ position: 'relative', width: 560, height: 280, backgroundColor: '#503A2B' }}>
    {inventory.items.map(invItem => {
      const item = data[invItem.id] as Item | undefined;
      const { x, y } = invItem.gridPos;
      if (item == null) return null;
      return <div key={`${x}_${y}`} style={{
        position: 'absolute',
        left: x * 70 + 3,
        top: y * 70 + 3,
        width: 64,
        height: 64,
        backgroundColor: invItem.equiped ? '#5D97CC' : 'transparent',
      }}>
        <div style={{ position: 'absolute', left: 2, top: 2, filter: 'brightness(0) blur(2px) opacity(0.75)' }}>
          <ItemIcon item={item} size={64} />
        </div>
        <div style={{ position: 'absolute', left: 0, top: 0 }}>
          <ItemIcon item={item} size={64} />
        </div>
        {(item.maxLvl ?? 1) > 1 && <div className="text-outline"
            style={{ position: 'absolute', right: 4, top: 0, color: 'orange' }}>
          {invItem.quality}
        </div>}
        {(item.stack ?? 1) > 1 && <div className="text-outline"
            style={{ position: 'absolute', left: 4, right: 4, bottom: 0, color: 'white', textAlign: 'center' }}>
          {invItem.stack}/{item.stack}
        </div>}
        {'durability' in item && item.durability[0] !== Infinity && <div
            style={{ position: 'absolute', left: 4, right: 4, bottom: 4, height: 4, background: '#0008' }}>
          <div style={{ height: '100%', width: `${Math.round(56 * invItem.durability / (item.durability[0] + item.durability[1] * invItem.quality))}px`, backgroundColor: 'white' }}></div>
        </div>}
      </div>
    })}
  </div>
}

function Skills({ skillData } : { skillData: SkillData }) {
  const translate = useContext(TranslationContext);
  return <dl>
    {[...skillData.entries()]
      .filter(([, { level }]) => level)
      .map(([skill, { level, accumulator }]) => {
        return <React.Fragment key={skill}>
          <dt><SkillIcon size={32} skill={skill} useAlt={false} /> {translate(`ui.skillType.${SkillType[skill]}`)}</dt>
          <dd>
            <div style={{ width: 200, height: 32, position: 'relative', backgroundColor: 'gray' }}>
              <div style={{ width: 200 * level / 100, height: 24, backgroundColor: '#cc0' }}></div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', color: 'white' }}
                className="text-outline">{Math.round(level)}</div>
              <div style={{ width: 200 * accumulator / 100, height: 8, backgroundColor: '#f80' }}></div>
            </div>
          </dd>
        </React.Fragment>;
      })
    }
  </dl>
}

function PlayerInfo({ value: player, onChange } : ValueProps<TPlayer>) {
  return <section>
    <h1>{player.playerName}</h1>
    <h2>Worlds ({player.worlds.size})</h2>
    <Worlds value={player.worlds} onChange={worlds => onChange({ ...player, worlds })} />
    {player.playerData && <>
      <h2>Appearance</h2>
      <Appearance value={player.playerData} onChange={playerData => onChange({ ...player, playerData })} />
      <h2>Inventory</h2>
      <Inventory inventory={player.playerData.inventory} />
      {player.playerData.skillData && <>
        <h2>Skills</h2>
        <Skills skillData={player.playerData.skillData} />
      </>}
    </>}
    <h2>Stats</h2>
    <Stats stats={player.stats} />
  </section>
}

function downloadFile(buffer: ArrayBuffer, name: string) {
  // Create a link and set the URL using `createObjectURL`
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = URL.createObjectURL(new Blob([buffer]));
  link.download = name;

  // It needs to be added to the DOM so it can be clicked
  document.body.appendChild(link);
  link.click();

  // To make this work on Firefox we need to wait
  // a little while before removing it.
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 0);
}

export function Player() {
  const [state, setState] = useState<TPlayer | null>(null);
  const [fileName, setFileName] = useState('character.fch');
  const [changed, setChanged] = useState(false);
  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    event.preventDefault();
    // Use DataTransfer interface to access the file(s)
    for (const file of event.dataTransfer?.files ?? []) {
      file.arrayBuffer().then(buffer => {
        setFileName(file.name);
        setState(read(buffer));
        setChanged(false);
      });
      break;
    }
  }, [setState]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  return <div style={{ flex: '1 0 auto' }} onDrop={onDrop} onDragOver={onDragOver}>
    {state == null
      ? "Drag a file here"
      : <>
          <button disabled={!changed} onClick={() => {
            const array = write(state);
            downloadFile(array.buffer, fileName);
            setChanged(false);
          }}>Save &amp; Download</button>
          <br />
          <PlayerInfo value={state}
            onChange={v => {
              setState(v);
              setChanged(true);
            }} />
        </>}
  </div>
}