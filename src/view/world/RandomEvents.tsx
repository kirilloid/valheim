import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import type { RandEventData } from './types';
import { EVENT_PERIOD } from '../../model/game';
import { FIGURE_SPACE, timeI2S } from '../../model/utils';
import { TranslationContext } from '../../effects';

function showTime(time: number) {
  return timeI2S(EVENT_PERIOD - Math.round(time));
}

export function RandomEvents({ value }: { value: RandEventData }) {
  const translate = useContext(TranslationContext);
  if (value.eventTimer < 0) {
    return <div className="WorldEdit__Events">
      <h2>Raids</h2>
      <p>
        Seems like events never happen at this world. Probably due to world modifiers.
      </p>
    </div>
  }
  if (!value.name) {
    return <div className="WorldEdit__Events">
      <h2>Raids</h2>
      <dl>
        <dt>timer</dt><dd>{showTime(value.eventTimer)} till next event</dd>
      </dl>
    </div>
  };
  return <div className="WorldEdit__Events">
    <h2>Raids</h2>
    <dl>
      <dt>timer</dt><dd>{showTime(value.eventTimer)}<sup>1</sup> till next event</dd>
      <dt>happening</dt><dd><Link to={`/events/${value.name}`}>{translate(value.name)}</Link></dd>
      <dt>where</dt><dd>{value.pos!.x} / {value.pos!.z}</dd>
      <dt>remaining</dt><dd>{value.time}</dd>
    </dl>
    <p><sup>1</sup> &mdash; depends on event rate in world modifiers</p>
  </div>;
}
