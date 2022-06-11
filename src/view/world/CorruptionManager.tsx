import React, { useState } from 'react';

import type { ValueProps } from '../parts/types';
import type { WorldData } from './types';
import { Mistake, ZDOData, ZDOCorruption, MistakeLevel } from '../../file/types';

import { check } from '../../file/zdo';
import { groupBy, mapValues, runGenerator } from '../../model/utils';
import { MistakeLevels } from '../../file/zdo/check';

function* checkZdos(data: WorldData): Generator<number, WorldData, void> {
  const mistakes: ZDOCorruption[] = [];
  for (const [index, zdo] of data.zdo.zdos.entries()) {
    if ((index & 0x3FFF) === 0) yield index;
    const { mistake, offset } = check(data, zdo);
    if (mistake !== Mistake.None) {
      mistakes.push({ mistake, offset, index });
    }
  }
  if (mistakes.length === 0) {
    data.zdo._checked = true;
    return data;
  }
  return {
    ...data,
    zdo: {
      ...data.zdo,
      corruptions: data.zdo.corruptions.concat(mistakes),
      _checked: true,
    }
  };
}

function deleteBadObjects(zdo: ZDOData): ZDOData {
  const { zdos } = zdo;
  const indicesToDelete = [];
  const corruptions: ZDOCorruption[] = [];
  for (const corr of zdo.corruptions) {
    const level = MistakeLevels[corr.mistake];
    if (level === MistakeLevel.ERROR) {
      indicesToDelete.push(corr.index);
    } else {
      corruptions.push(corr);
    }
  }
  while (indicesToDelete.length > 0) {
    const index = indicesToDelete.pop()!;
    if (index === zdos.length - 1) {
      zdos.pop();
    } else {
      zdos[index] = zdos.pop()!;
    }
  }
  return {
    ...zdo,
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

function Corruptions({ value, onChange }: ValueProps<ZDOData>) {
  const problems = mapValues(
    groupBy(value.corruptions, cor => MistakeLevels[cor.mistake]),
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

export function CorruptionManager({ value, onChange }: ValueProps<WorldData>) {
  const [state, setState] = useState<State>({ step: value.zdo._checked ? 'checked' : 'unchecked' });
  return <>
    {state.step === 'progress' && 
      <section>
        Scanning for problems &hellip;
        <progress value={state.progress} max={value.zdo.zdos.length} style={{ width: '100%' }} />
      </section>
    }
    <Corruptions value={value.zdo} onChange={zdo => onChange({ ...value, zdo })} />
    {state.step === 'unchecked' && <section>
      <input type="button"
        className="btn btn--primary"
        value="run rigorous check"
        onClick={async () => {
          const newValue = await runGenerator(
            checkZdos(value),
            progress => setState({ step: 'progress', progress }),
          );
          setState({ step: 'checked' });
          if (newValue !== value) {
            onChange(newValue);
          }
        }} />
    </section>}
  </>
}
