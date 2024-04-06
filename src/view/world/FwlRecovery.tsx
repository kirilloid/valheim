import React, { useContext, useLayoutEffect, useRef, useState } from 'react';

import { getWorldSeed, getZonesBitMap, hasCartographyTable } from '../../model/zdo-selectors';
import { solve, stableHashCode } from '../../model/hash';
import { BitMap, getMatchScore } from '../../model/BitMap';
import { assertNever } from '../../model/utils';

import { read as readWorld } from '../../file/World';
import { read as readPlayer } from '../../file/Player';
import { read as readMapData } from '../../file/MapData';
import { write as writeFwl, Data as FwlData } from '../../file/fwl';

import { downloadFile } from '../helpers';
import { FilePeeker } from '../parts/file';
import { WorldMetaInfo } from './WorldMeta';
import { TranslationContext } from '../../effects';
import { ItemIcon } from '../parts/Icon';
import { data } from '../../data/itemDB';

type State = {
  step: 'start';
} | {
  step: 'pre-world';
} | {
  step: 'world';
  version: number;
  seed: number | undefined;
  hasTable: boolean;
  explored: BitMap;
  name: string;
} | {
  step: 'pre-player';
  version: number;
  seed: number;
  hasTable: boolean;
  explored: BitMap;
  name: string;
} | {
  step: 'player';
  version: number;
  seed: number;
  hasTable: boolean;
  explored: BitMap;
  worlds: { id: bigint; bitmap: BitMap; matchScore: number }[];
  index: number;
  name: string;
} | {
  step: 'review';
  id?: bigint;
  data: FwlData;
} | {
  step: 'success';
}

function getFwlData(name: string, version: number, seed: number, uid?: bigint): FwlData {
  if (uid == null) {
    // this is stableHashCode from local host/domain
    const hostRandom = Math.round(Math.random() * (2 ** 32) - (2 ** 31))
    const pureRandom = Math.round(Math.random() * (2 ** 31 + 1));
    uid = BigInt(stableHashCode(name)) + BigInt(hostRandom) + BigInt(pureRandom);
  }

  return {
    version,
    name,
    seedName: solve(seed),
    seed,
    uid,
    worldGenVersion: version >= 29 ? 2 : 1,
    needsDB: true,
    keys: {},
  }
}

function drawBitMap(elt: HTMLCanvasElement | null, bitmap: BitMap, r: number, g: number, b: number): void {
  if (elt == null) return;
  const ctx = elt.getContext('2d');
  if (ctx == null) return;
  const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  for (let y = 0; y < bitmap.height; y++) {
    for (let x = 0; x < bitmap.width; x++) {
      if (bitmap.get(x, y)) {
        const index = (x + y * bitmap.width) << 2;
        imageData.data[index] = r;
        imageData.data[index + 1] = g;
        imageData.data[index + 2] = b;
        imageData.data[index + 3] = 255;
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

function Steps({ state }: {
  state: State;
}) {
  // ☐☒☑🗹
  switch (state.step) {
    case 'start':
    case 'pre-world':
      return <>
        <div>☐ name</div>
        <div>☐ seed</div>
        <div>☐ id</div>
      </>;
    case 'world':
    case 'pre-player':
      return <>
        <div>☑ name</div>
        <div>{state.seed == null ? '☒' : '☑'} seed</div>
        <div>☐ id</div>
      </>;
    case 'player':
      return <>
        <div>☑ name</div>
        <div>☑ seed</div>
        <div>☐ id</div>
      </>;
    case 'review':
      return <>
        <div>☑ name</div>
        <div>☑ seed</div>
        <div>{state.id == null ? '☒' : '☑'} id</div>
      </>;
    case 'success':
      return null;
    default:
      return assertNever(state);
  }
}

function extractOriginalName(fileName: string): string {
  return fileName
    .replace(/\.db(\.old)?$/, '')
    .replace(/_backup_\d{8}-\d{6}$/, '')
    .replace(/_backup_auto-\d{14}$/, '')
}

type StepProps<S extends State['step']> = { state: State & { step: S }, setState: React.Dispatch<React.SetStateAction<State>> }

function StartStep({ setState }: StepProps<'start'>) {
  return <>
    <p>
      If you have lost your <code>world.fwl</code> file, but still have <code>world.db</code> file, it's possible to recover from such a situation.<br/>
      We'd need to recover world <strong>name</strong>, <strong>seed</strong> and <strong>id</strong><br/>
      First don't forget to shutdown you Valheim game or server<br/>
      <button type="button" className="btn btn--primary" onClick={() => setState({ step: 'pre-world' })}>Start</button>
    </p>
  </>;
}

function PreWorldStep({ setState }: StepProps<'pre-world'>) {
  return <>
    <p>Please, provide <code>world.db</code> file:</p>
    <div className="panel">
      <FilePeeker
        key="world"
        defaultFileName="world.db"
        extension="db"
        reader={readWorld}
        onLoad={(value, name) => {
          const { version } = value;
          const seed = getWorldSeed(value.zdo.zdos);
          const hasTable = hasCartographyTable(value.zdo.zdos);
          const explored = getZonesBitMap(value.zdo.zdos);
          setState({
            step: 'world',
            version,
            seed,
            hasTable,
            explored,
            name: extractOriginalName(name),
          });
        }}
        subpath="worlds"
      />
    </div>
  </>;
}


function WorldStep({ state, setState }: StepProps<'world'>) {
  const seed = state.seed;
  if (seed == null) {
    return <>
      <div className="error">Too little of world was generated, cannot recover <strong>world seed</strong></div>
      <button type="button" className="btn btn--warning">Back to start</button>
    </>
  }
  return <>
    <p>
      <strong>World seed</strong> is recovered. But in order for the map exploration to not be lost, we need to recover world id.<br/>
      <>{
          state.hasTable
          ? <div className="info notification-with-icon">
              <ItemIcon item={data.piece_cartographytable} />
              <span>There's cartography table in this world, you can skip that step and restore map from it.</span>
            </div>
          : <div className="warning notification-with-icon">
              <ItemIcon item={data.piece_cartographytable} />
              <span>There's no cartography table in this world, you are advised to restore world from character file, but you can still skip this step.</span>
            </div>
        }
        <button type="button" className="btn btn--primary" onClick={() => {
          setState({
            ...state,
            step: 'pre-player',
            seed,
          });
        }}>Recover</button>
        {' '}
        <button type="button" className="btn btn--secondary" onClick={() => {
          setState({
            step: 'review',
            data: getFwlData(state.name, state.version, seed),
          });
        }}>Skip</button>
      </>
    </p>
  </>;
}

function PrePlayerStep({ state, setState }: StepProps<'pre-player'>) {
  return <>
    <p>
      Now provide <code>character.fch</code> file for a character who visited that world before.
    </p>
    <div className="panel">
      <FilePeeker
        key="player"
        defaultFileName="player.fch"
        extension="fch"
        reader={readPlayer}
        onLoad={value => {
          const worlds = [];
          for (const [id, { mapData }] of value.worlds.entries()) {
            if (mapData == null) continue;
            const data = readMapData(mapData);
            const bitmap = new BitMap(data.tileSize, data.tileSize, data.explored);
            const matchScore = getMatchScore(state.explored, bitmap);
            if (matchScore > 0) {
              worlds.push({ id, bitmap, matchScore });
            }
          }
          worlds.sort((a, b) => b.matchScore - a.matchScore);
          setState({ ...state, step: 'player', worlds, index: 0 });
        }}
        subpath="characters"
      />
    </div>
  </>;
}

function PlayerStep({ state, setState }: StepProps<'player'>) {
  const exploredCanvas = useRef<HTMLCanvasElement>(null);
  const worldCanvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    drawBitMap(exploredCanvas.current, state.explored, 0, 0, 127);
  }, [state.explored]);

  const world = state.worlds[state.index ?? 0]!;

  useLayoutEffect(() => {
    drawBitMap(worldCanvas.current, world?.bitmap, 255, 255, 0);
  }, [world?.bitmap]);

  if (state.worlds.length === 0) {
    return <div>
      Unfortunately, provided chatacter hasn't visited matching worlds.
      <button className="btn btn--secondary" onClick={() => setState({ ...state, step: 'world' })}>Pick another character</button>
      <button className="btn btn--primary" onClick={() => setState({
        step: 'review',
        data: getFwlData(state.name, state.version, state.seed),
      })}>Skip</button>
    </div>
  }

  const { width, height } = state.explored;

  return <div>
    {state.worlds.length === 1
      ? <div>We have found only one world matching your exploration pattern.</div>
      : <>
          <div>
            We have found several world matching your exploration pattern.<br/>
            Please, adjust if you think something is better
          </div>
          <select onChange={e => {
            const value = Number(e.target.value);
            setState({ ...state, index: value });
          }} value={state.index}>{state.worlds.map((w, i) => {
            return <option key={String(w.id)} value={i}>match: {w.matchScore}</option>
          })}</select>
        </>
    }
    {' '}
    <button className="btn btn--primary" onClick={() => {
      const id = state.index == null ? undefined : state.worlds[state.index]?.id;
      setState({
        step: 'review',
        data: getFwlData(state.name, state.version, state.seed, id),
        id,
      });
    }}>Confirm</button>
    {' '}
    <button className="btn btn--secondary" onClick={() => {
      setState({
        step: 'review',
        data: getFwlData(state.name, state.version, state.seed),
      });
    }}>Skip</button>
    <div className="panel">
      <ul className="ExplorationMap__legend">
        <li><div className='ExplorationMap__legend-marker' style={{ background: '#008' }} /> world generated</li>
        <li><div className='ExplorationMap__legend-marker' style={{ background: '#ff0' }} /> explored by provided character</li>
      </ul>
      <div className="ExplorationMap" style={{ width, height }}>
        <canvas width={width} height={height}
          className="ExplorationMap__figure"
          style={{ width, height }}
          ref={exploredCanvas} />
        <canvas width={world.bitmap.width} height={world.bitmap.height}
          className="ExplorationMap__figure"
          style={{ width, height }}
          ref={worldCanvas} />
        <svg width={width} height={height} className="ExplorationMap__figure"
          style={{ stroke: 'var(--color-text)' }}>
          <circle r={width / 2 - 0.5} cx={width / 2} cy={height / 2}
            strokeWidth="1" stroke="#000" fill="none" />
        </svg>
      </div>
    </div>
  </div>
}

function ReviewStep({ state, setState }: StepProps<'review'>) {
  const translate = useContext(TranslationContext);

  const data = writeFwl(state.data);
  const fileName = `${state.data.name}.fwl`;
  const file = new File([data.buffer], fileName);
  return <div className="FileEditor">
    <div>Review file details below. You may want to adjust world modifiers as those are impossible to recover and were reset to normal.</div>
    <div className="panel">
      <div className="FileEditor__controls">
        <button className="btn btn--primary"
          onClick={() => {
            // in case it's edited, update the file
            const data = writeFwl(state.data);
            const fileName = `${state.data.name}.fwl`;
            downloadFile(data, fileName);
            setState({ step: 'success' });
          }}>
          {translate('ui.fileEditor.save')}
        </button>
        {' '}
        <button className="btn btn--danger"
          onClick={() => setState({ step: 'start' })}>
          Cancel
        </button>
      </div>
      <WorldMetaInfo value={state.data} file={file} onChange={data => {
        setState({ step: 'review', data, id: state.id });
      }} />
    </div>
  </div>
}

function SuccessStep(_: StepProps<'success'>) {
  return <p>
    File should have been successfully recovered. Move it from downloads into the right folder and try starting your world.
  </p>
}

function StepSpecific({ state, setState }: {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}) {
  switch (state.step) {
    case 'start':
      return <StartStep state={state} setState={setState} />
    case 'pre-world':
      return <PreWorldStep state={state} setState={setState} />
    case 'world':
      return <WorldStep state={state} setState={setState} />
    case 'pre-player':
      return <PrePlayerStep state={state} setState={setState} />
    case 'player':
      return <PlayerStep state={state} setState={setState} />
    case 'review':
      return <ReviewStep state={state} setState={setState} />
    case 'success':
      return <SuccessStep state={state} setState={setState} />
    default:
      return assertNever(state);
  }
}

export function FwlRecovery() {
  const [state, setState] = useState<State>({ step: 'start' });
  return <>
    <h1>Meta-file recovery wizard</h1>
    <Steps state={state} />
    <StepSpecific state={state} setState={setState} />
  </>;
}
