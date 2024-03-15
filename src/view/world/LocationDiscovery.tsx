import React, { useContext, useMemo } from 'react';

import type { WorldData, ZoneSystemData } from './types';

import { getTotalLocations } from '../../model/zdo-selectors';
import { TranslationContext } from '../../effects';
import { CopyIcon } from '../parts/Icon';

function formatLocationRow(l: ZoneSystemData['locationInstances'][number]): string {
  return `${l.generated ? 'v' : 'x'} | ${l.name.padEnd(20)} |${l.pos.x.toFixed(3).padStart(10)}|${l.pos.y.toFixed(3).padStart(8)}|${l.pos.z.toFixed(3).padStart(10)}`;
}

function formatLocationsTable(locs: ZoneSystemData['locationInstances'] | undefined): string {
  if (locs == null) return '';
  return `g | name                 |     x    |   y    |     z    |\n`
      +  `--+----------------------+----------+--------+----------+\n`
      + locs.map(formatLocationRow).join('\n');
}

export function LocationDiscovery({ value }: { value: WorldData }) {
  const translate = useContext(TranslationContext);
  const [locationsTotal] = getTotalLocations(value.zoneSystem);

  const instances = value.zoneSystem?.locationInstances;

  const formattedText = useMemo(() => formatLocationsTable(instances), [instances]);

  return <div className="WorldEdit__Locations">
    <h2>
      {translate('ui.locations')}
      {formattedText.length > 0 && <span style={{ float: 'right', cursor: 'pointer' }}
        onClick={() => {
          navigator.clipboard.writeText(formattedText);
        }}
        title="copy FULL locations table as text">
        <CopyIcon size={32} />
      </span>}
    </h2>
    <div className="WorldEdit__LocationsTable">
      <table>
        <colgroup>
          <col width="50%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <thead>
          <tr>
            <th>name</th>
            <th>generated</th>
            <th>{translate('ui.total')}</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(locationsTotal).map(([name, { generated, total, nominal }]) =>
            <tr key={name} className={total ? '' : 'disabled'}>
              <td>{translate(`ui.location.${name}`)}</td>
              <td>{generated}</td>
              <td>{total === nominal ? total : `${total}/${nominal}`}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  </div>
}
