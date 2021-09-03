import React, { useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

import { TranslationContext } from '../effects';
import { data } from '../model/objects';
import { timeI2S } from '../model/utils';
import { ItemIcon } from './Icon';
import { Area, InlineObject, InlineObjectWithIcon, List, yesNo } from './helpers';
import { events } from '../model/events';
import { EntityId } from '../types';

function creature(id: EntityId) {
  return <Link key={id} to={`/obj/${id}`}><ItemIcon item={data[id]} useAlt /></Link>
}

export function GameEvent() {
  const { id } = useParams<{ id: string }>();
  const translate = useContext(TranslationContext);
  const event = events.find(e => e.id === id);
  if (event == null) {
    return <span className="error">
      Event "{id}" not found
    </span>
  }
  const {
    killed,
    notKilled,
    duration,
    spawns,
    base,
  } = event;
  return (
    <>
      <h1>
        {translate(event.id)}
      </h1>
      <section>
        <h2><Link to="/events">{translate(`ui.event`)}</Link></h2>
        <dl>
          <dt>opening</dt>
          <dd>"{translate(`${id}.start`)}"</dd>
          <dt>ending</dt>
          <dd>"{translate(`${id}.end`)}"</dd>
          {killed.length ? <>
            <dt>requires killed</dt>
            <dd><List>{killed.map(id => <InlineObjectWithIcon key={id} id={id} />)}</List></dd>
          </> : null}
          {notKilled.length ? <>
            <dt>requires not killed</dt>
            <dd><List>{notKilled.map(id => <InlineObjectWithIcon key={id} id={id} />)}</List></dd>
          </> : null}
          <dt>biomes</dt>
          <dd><List>{event.biomes.map(bid => <Area key={bid} area={bid} />)}</List></dd>
          <dt>at player's base</dt>
          <dd>{yesNo(base)}</dd>
          <dt>duration</dt>
          <dd>{timeI2S(duration)}</dd>
        </dl>        
      </section>
      <section>
        <h2>creatures</h2>
        <table>
          <thead>
            <tr>
              <th>icon</th>
              <th>name</th>
              <th>chance</th>
              <th>period</th>
              <th>max</th>
            </tr>
          </thead>
          <tbody>
            {spawns.map(s => <tr key={s.id}>
              <td>{creature(s.id)}</td>
              <td>{<InlineObject id={s.id} />}</td>
              <td>{`${((s.chance ?? 1) * 100).toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}%`}</td>
              <td>{timeI2S(s.interval)}</td>
              <td>{s.max}</td>
            </tr>)}
          </tbody>
        </table>
      </section>
    </>
  );
}

export function GameEventTable() {
  const translate = useContext(TranslationContext);
  return (
    <>
      <h1>
        {translate('ui.page.events')}
      </h1>
      <section>
        <table width="100%">
          <thead>
            <tr>
              <th>event</th>
              <th>killed</th>
              <th>not killed</th>
              <th>duration</th>
              <th>spawns (max)</th>
              <th>base</th>
              <th>biomes</th>
            </tr>
          </thead>
          <tbody>
            {events.map(e => <tr key={e.id}>
              <td><Link to={`/event/${e.id}`}>{translate(e.id)}</Link></td>
              <td><List>{e.killed.map(creature)}</List></td>
              <td><List>{e.notKilled.map(creature)}</List></td>
              <td>{timeI2S(e.duration)}</td>
              <td><List>{e.spawns.map(s => <React.Fragment key={s.id}>
                {creature(s.id)}×{s.max}
              </React.Fragment>)}</List></td>
              <td>{yesNo(e.base)}</td>
              <td><List>{e.biomes.map(b => <Area key={b} area={b} />)}</List></td>
            </tr>)}
          </tbody>
        </table>
      </section>
    </>
  );
}
