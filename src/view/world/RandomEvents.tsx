import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { TranslationContext } from '../../effects';
// import type { ValueProps } from '../parts/types';
import type { RandEventData } from './types';

export function RandomEvents({ value }: { value: RandEventData }) {
  const translate = useContext(TranslationContext);
  if (!value.name) {
    return <>
      <dt>timer</dt><dd>{value.eventTimer}</dd>
    </>
  };
  return <>
    <dt>timer</dt><dd>{value.eventTimer}</dd>
    <dt>happening</dt><dd><Link to={`/events/${value.name}`}>{translate(value.name)}</Link></dd>
    <dt>where</dt><dd>{value.pos!.x} / {value.pos!.z}</dd>
    <dt>remaining</dt><dd>{value.time}</dd>
  </>
}
