import React, { useContext } from 'react';

import type { WorldData } from './types';

import { getTotalLocations } from '../../model/zdo-selectors';
import { TranslationContext } from '../../effects';

export function LocationDiscovery({ value }: { value: WorldData }) {
  const translate = useContext(TranslationContext);
  const [locationsTotal] = getTotalLocations(value.zoneSystem);

  return <div className="WorldEdit__Locations">
    <h2>{translate('ui.locations')}</h2>
    <div className="WorldEdit__LocationsTable">
      <table>
        <thead>
          <tr>
            <th>name</th>
            <th>generated</th>
            <th>total</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(locationsTotal).map(([name, { generated, total, nominal }]) => <tr key={name}>
            <td>{translate(`ui.location.${name}`)}</td>
            <td>{generated}</td>
            <td>{total === nominal ? total : `${total}/${nominal}`}</td>
          </tr>)}
        </tbody>
      </table>
    </div>
  </div>
}