import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import { WORLD_SIZE } from '../../model/game';
import { stableHashCode, toggleItem, Vector3 } from '../../model/utils';
import { generateZones } from '../../model/worker/generate-zones';
import { generateTerrain } from '../../model/worker/generate-terrain';
import { RegisteredLocation } from '../../model/zone-system';

import { TranslationContext, Translator } from '../../effects';
import { PanView } from '../parts/PanView';

const locationTypes: Record<string, { type: string; color: string; icon?: string; }> = {
  StartTemple: { type: 'Spawn', color: '#fff' },
  Eikthyrnir: { type: 'Boss', color: '#fff', icon: 'boss' },
  GDKing: { type: 'Boss', color: '#fff', icon: 'boss' },
  Bonemass: { type: 'Boss', color: '#fff', icon: 'boss' },
  Dragonqueen: { type: 'Boss', color: '#fff', icon: 'boss' },
  GoblinKing: { type: 'Boss', color: '#fff', icon: 'boss' },
  Vendor_BlackForest: { type: 'Trader', color: '#fff', icon: 'trader' },
  // boss stones
  // treasure
  Leviathan: { type: 'Leviathan', color: '#fff', icon: 'circle' },
  Greydwarf_camp: { type: 'Greydwarf camp', color: '#fff', icon: 'house' },
  Goblincamp: { type: 'Goblin camp', color: '#fff', icon: 'house' },
  Crypt: { type: 'Crypt', color: '#fff', icon: 'hammer_stone' },
  SunkenCrypt: { type: 'Sunken crypt', color: '#fff', icon: 'hammer_stone' },
  TrollCave: { type: 'Troll cave', color: '#fff', icon: 'house' },
  // maypole
  // beehive
  WoodVillage: { type: 'Draugr village', color: '#fff', icon: 'house' },
  WoodFarm: { type: 'Village', color: '#fff', icon: 'house' },
  DrakeNest: { type: 'Dragon egg', color: '#fff', icon: 'circle' },
  ShipWreck: { type: 'Shipwreck', color: '#fff', icon: 'circle' },
  InfestedTree: { type: 'Guck', color: '#fff', icon: 'circle' },
  TarPit: { type: 'TarPit', color: '#fff', icon: 'circle' },
  // totem poles
};

type MapItem = {
  pos: Vector3;
  subtype: string;
  title: string;
}

function getGroups(data: { locations: RegisteredLocation[]; leviathans: Vector3[] }, translate: Translator) {
  const groups: Record<string, { items: MapItem[]; color: string; icon?: string }> = {};
  for (const loc of data.locations) {
    const locType = locationTypes[loc.location.typeId];
    if (locType == null) continue;
    const group = groups[locType.type] ?? (groups[locType.type] = {
      items: [],
      color: locType.color,
      icon: locType.icon,
    });
    const type = loc.location.typeId;
    group.items.push({
      pos: loc.pos,
      subtype: type,
      title: translate(`ui.location.${type}`)
    });
  }
  const subtype = '';
  const title = translate(`Leviathan`);
  groups.Leviathan = {
    items: data.leviathans.map(pos => ({
      pos,
      subtype,
      title,
    })),
    color: '#fff',
    icon: 'circle' 
  }
  return groups;
}

const WorldMap = React.memo((props: { seed: string }) => {
  const translate = useContext(TranslationContext);
  const { seed } = props;
  const SIZE = 2048;
  function canvas2worldCoord(c: number): number {
    return (c / SIZE - 0.5) * WORLD_SIZE;
  }
  function world2canvasCoord(c: number): number {
    return (c / WORLD_SIZE + 0.5) * SIZE;
  }
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mapProgress, setMapProgress] = useState(0);
  const [locProgress, setLocProgress] = useState(0);
  const [locations, setLocations] = useState<{
    locations: RegisteredLocation[];
    leviathans: Vector3[];
  }>({
    locations: [],
    leviathans: [],
  });
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (seed === '') return;
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const numSeed = stableHashCode(seed);
    return generateTerrain(numSeed, SIZE, 3, (data) => {
      const array = new Uint8ClampedArray(data.buffer);
      const imageData = new ImageData(array, data.width, data.height);
      ctx.putImageData(imageData, data.x, data.y);
      setMapProgress(data.progress);
    });
  }, [seed]);

  useEffect(() => {
    if (seed === '') return;
    const numSeed = stableHashCode(seed);
    return generateZones(numSeed, setLocProgress, setLocations);
  }, [seed]);

  const locGroups = getGroups(locations, translate);

  return <>
    <dl className="overlay">
      <dt>terrain</dt><dd><progress max={1} value={mapProgress} style={{ width: '100%', height: 16 }} /></dd>
      <dt>{translate('ui.locations')}</dt><dd><progress max={1} value={locProgress} style={{ width: '100%', height: 16 }} /></dd>
    </dl>
    <div className="overlay">zoom: {Math.round(zoom * 100)}%</div>
    <div className="overlay">position: {Math.round(canvas2worldCoord(pos.x))} / {-Math.round(canvas2worldCoord(pos.y))}</div>
    <div className="overlay" style={{ width: 240 }}>
      <h3>{translate('ui.locations')}</h3>
      <ul>
        {Object.entries(locGroups).map(([key, group]) => <li key={key}>
          <label><input type="checkbox"
            checked={selectedLocations.includes(key)}
            onChange={() => setSelectedLocations(toggleItem(selectedLocations, key, !selectedLocations.includes(key)))} />{key} ({group.items.length})</label>
        </li>)}
      </ul>
    </div>
    <div className="WorldGen">
      <PanView maxZoom={20} onZoomChange={setZoom} onMouseMove={setPos}>
        <canvas className="WorldGen__Map" width={SIZE} height={SIZE} ref={canvasRef}
          style={{ width: `${SIZE}px`, height: `${SIZE}px` }} />
        {selectedLocations.map(key => {
          const group = locGroups[key];
          if (group == null) return null;
          const typeIds = new Set(group.items.map(item => item.subtype));
          return <React.Fragment key={key}>
            {group.items.map((item, i) => <div key={i} className="WorldGen__marker text-outline" style={{
              left: world2canvasCoord(item.pos.x),
              bottom: world2canvasCoord(item.pos.z),
              backgroundImage: group.icon ? `url(/icons/icon/${group.icon}_64.png)` : '',
            }}>
              {typeIds.size > 1 ? translate(`ui.location.${item.subtype}`) : ''}
            </div>)}
          </React.Fragment>
        })}
      </PanView>
    </div>
  </>
});

export function WorldGenerator() {
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams<{ seed?: string }>();
  const [seed, setSeed] = useState(params.seed ?? '');
  const history = useHistory();

  useEffect(() => {
    const input = inputRef.current;
    if (input != null) input.value = seed;
  }, [seed]);

  return (<>
    <section className="overlay">
      <h1>World Generator</h1>
      <label>Seed: <input ref={inputRef} type="text" placeholder="Enter seed" /></label>
      <button className="btn" onClick={() => {
        const newSeed = inputRef.current?.value ?? '';
        const path = newSeed.length ? `/world-gen/${newSeed}` : '/world-gen';
        if (history.location.pathname !== path) {
          history.replace(path);
        }
        setSeed(newSeed);
      }}>Generate</button>
    </section>
    <WorldMap seed={seed} />
  </>);
}
