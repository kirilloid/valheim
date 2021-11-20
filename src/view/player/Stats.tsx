import React from 'react';

import type { Player } from '../../file/Player';

export function Stats({ stats } : { stats: Player['stats'] }) {
  return <dl>
    <dt>kills (PvP)</dt><dd>{stats.kills}</dd>
    <dt>deaths (any)</dt><dd>{stats.deaths}</dd>
    <dt>items crafted</dt><dd>{stats.crafts}</dd>
    <dt>structures built</dt><dd>{stats.builds}</dd>
  </dl>
}

