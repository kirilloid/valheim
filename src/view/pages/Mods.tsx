import React from 'react';

import { ModConfig, modLinks } from '../../mods';
import { ModLinks } from '../helpers';

const modsData = Object.entries(modLinks);

const fullySupported = modsData.filter(kv => kv[1].fullSupport);
const onlyPrefabNames = modsData.filter(kv => !kv[1].fullSupport);

function ModList({ mods }: { mods: [string, ModConfig][] }) {
  return <table style={{ width: '100%' }}>
    <thead>
      <tr>
        <td>name</td>
        <td>version</td>
        <td>links</td>
      </tr>
    </thead>
    {mods.map(([modId, linkData]) =>
    <tr key={modId}>
      <td>{modId}</td>
      <td>{linkData.version}</td>
      <td><ModLinks {...linkData} /></td>
    </tr>
  )}</table>;
}

export function Mods() {
  return <article>
    <h1>Mods</h1>
    <p>
      This site supports not only Vanilla game, but also a range of mods.<br/>
      By default content from mods is not included, you can enable it in the settings menu (top right button).<br/>
      Obviously, I cannot support all mods, so I'm trying to balance between popularity and easiness of adding a mod.
    </p>
    <h2>Fully supported</h2>
    <p>Items/buildings from this mods are supported in details. They could be included in search results in settings.</p>
    <ModList mods={fullySupported} />
    <h2>Names only</h2>
    <p>For those mods only item names are recognized in world editor</p>
    <ModList mods={onlyPrefabNames} />
  </article>
}
