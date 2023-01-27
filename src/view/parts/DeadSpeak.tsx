import React, { useContext } from 'react';

import type { Deadspeak as TDeadspeak } from '../../types';

import { TranslationContext } from '../../effects';


export function DeadSpeak({ texts }: TDeadspeak) {
  const translate = useContext(TranslationContext);

  return <section>
    <h2>Talking</h2>
    <details>
      <summary>This item occasionally says phrases if mounted somewhere</summary>
      <ul className="quote">
        {texts.map((s, i) => <li key={i}>{translate(s)}</li>)}
      </ul>
    </details>
  </section>;
}
