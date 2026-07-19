import React, { useState } from 'react';

import type { ValueProps } from '../parts/types';
import { Mistake, ZDODataLike, ZDOCorruption, MistakeLevel, removeZdosAtChunkIndices } from '../../file/types';

import { groupBy, mapValues, runGenerator } from '../../model/utils';
import { check } from '../../file/zdo';
import { MistakeLevels } from '../../file/zdo/check';

function* checkZdos(zdo: ZDODataLike): Generator<number, ZDODataLike, void> {
  const mistakes: ZDOCorruption[] = [];
  let processed = 0;
  for (const [chunkId, { zdos }] of zdo.chunks.entries()) {
    for (const [index, current] of zdos.entries()) {
      if ((processed & 0x3FFF) === 0) yield processed;
      const { mistake, offset } = check(current, chunkId);
      if (mistake !== Mistake.None) {
        mistakes.push({ mistake, offset, index, chunkId });
      }
      processed++;
    }
  }
  if (mistakes.length === 0) {
    return { ...zdo, _checked: true };
  }
  return {
    ...zdo,
    corruptions: (zdo.corruptions ?? []).concat(mistakes),
    _checked: true,
  };
}

function deleteBadObjects(zdo: ZDODataLike): ZDODataLike {
  const deletions: { chunkId: number; indexInChunk: number }[] = [];
  const corruptions: ZDOCorruption[] = [];
  for (const corr of zdo.corruptions ?? []) {
    const level = MistakeLevels[corr.mistake];
    if (level === MistakeLevel.ERROR) {
      deletions.push({ chunkId: corr.chunkId, indexInChunk: corr.index });
    } else {
      corruptions.push(corr);
    }
  }
  const newZdo = removeZdosAtChunkIndices(zdo, deletions);
  return {
    ...newZdo,
    corruptions,
  };
}

function Problems({ problems, title, color }: { problems: Partial<Record<Mistake, ZDOCorruption[]>>, title: string, color: string }) {
  return <section style={{ color }}>
    <h3>{title}</h3>
    <ul>{Object.entries(problems).map(([key, values]) => values != null && <li key={key}>
      {Mistake[key as any as Mistake]}: {values.length}
    </li>)}</ul>
  </section>
}

function Corruptions({ value, onChange }: ValueProps<ZDODataLike>) {
  const problems = mapValues(
    groupBy(value.corruptions ?? [], cor => MistakeLevels[cor.mistake]),
    corrs => groupBy(corrs, cor => cor.mistake),
  );
  const {
    [MistakeLevel.ERROR]: errors,
    [MistakeLevel.WARNING]: warnings,
    [MistakeLevel.NOTICE]: notices
  } = problems;
  
  if (Object.keys(problems).length === 0) {
    return value._checked
      ? <div>Rigorous check found no problems</div>
      : <div>Initial check found no problems</div>;
  }
  return <>
    {value._checked
      ? <div>Rigorous check found following problems:</div>
      : <div>Initial check found following problems:</div>
    }
    {errors != null &&
      <>
        <Problems title="errors" problems={errors} color="var(--color-danger)" />
        <input type="button" className="btn btn--danger" value="delete" onClick={() => onChange(deleteBadObjects(value))} /> corrupted object(s)
      </>
    }
    {warnings != null && <Problems title="warnings" problems={warnings} color="var(--color-warning)" />}
    {notices != null && <Problems title="suspicous" problems={notices} color="var(--color-warning)" />}
  </>;
}

type State = {
  step: 'unchecked';
} | {
  step: 'progress';
  progress: number;
} | {
  step: 'checked';
}

export function CorruptionManager({ value, onChange }: ValueProps<ZDODataLike>) {
  const [state, setState] = useState<State>({ step: value._checked ? 'checked' : 'unchecked' });
  return <>
    {state.step === 'progress' && 
      <section>
        Scanning for problems &hellip;
        <progress value={state.progress} max={value.totalZDOs} style={{ width: '100%' }} />
      </section>
    }
    <Corruptions value={value} onChange={onChange} />
    {state.step === 'unchecked' && <section>
      <input type="button"
        className="btn btn--primary"
        value="run rigorous check"
        onClick={async () => {
          try {
            const newValue = await runGenerator(
              checkZdos(value),
              progress => setState({ step: 'progress', progress }),
            );
            setState({ step: 'checked' });
            if (newValue !== value) {
              onChange(newValue);
            }
          } catch {
            alert("There was an error");
          }
        }} />
    </section>}
  </>
}
