import React, { useContext } from 'react';

import type { EmptyState, PathsProps } from './types';

import { Tabs } from '../Tabs';
import { TranslationContext } from '../../../effects';
import { Icon } from '../Icon';

function GameStoreIcon({ type }: { type: string }) {
  return <>
    <picture className="FileEditor__icon FileEditor__icon--light">
      <img alt=""
        src={`/icons/${type}-light_24.png`}
        srcSet={`/icons/${type}-light_48.png 2x`}
      />
    </picture>
    <picture className="FileEditor__icon FileEditor__icon--dark">
      <img alt=""
        src={`/icons/${type}-dark_24.png`}
        srcSet={`/icons/${type}-dark_48.png 2x`}
      />
    </picture>
  </>;
}

function SteamFilePaths({ subpath }: PathsProps) {
  const translate = useContext(TranslationContext);
  return (<>
    <dl className="FileEditor__pathlist">
      <dt><Icon id="file_cloud" size={28} alt="" /> {translate('ui.fileEditor.type.cloud')}</dt>
      <dd><code>%ProgramFiles(x86)%\<wbr/>Steam\<wbr/>userdata\<wbr/><em title={translate('ui.fileEditor.steamIdNote')}>&lt;steam-id&gt;</em>\<wbr/>892970\<wbr/>remote\<wbr/>{subpath}</code></dd>
      <dt><Icon id="file_local" size={28} alt="" /> {translate('ui.fileEditor.type.local')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}_local</code></dd>
      <dt><Icon id="file_legacy" size={28} alt="" /> {translate('ui.fileEditor.type.legacy')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}</code></dd>
    </dl>
    <p>
      <code>%ProgramFiles(x86)%</code> is normally <code>C:\Program Files (x86)\</code><br/>
      <code>%userprofile%</code> is normally <code>C:\Users\<wbr/><em>&lt;username&gt;</em>\</code>
    </p>
  </>);
}

function GamePassFilePaths({ subpath }: PathsProps) {
  const translate = useContext(TranslationContext);
  return (<>
    <dl className="FileEditor__pathlist">
      <dt><Icon id="file_cloud" size={28} alt="" /> {translate('ui.fileEditor.type.cloud')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>Local\<wbr/>Packages\<wbr/>CoffeeStainStudios.Valheim_496a1srhmar9w\<wbr/>SystemAppData\<wbr/>wgs</code></dd>
      <dt><Icon id="file_local" size={28} alt="" /> {translate('ui.fileEditor.type.local')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}_local</code></dd>
      <dt><Icon id="file_legacy" size={28} alt="" /> {translate('ui.fileEditor.type.legacy')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}</code></dd>
    </dl>
    <p>
      <code>%userprofile%</code> is normally <code>C:\Users\<wbr/><em>&lt;username&gt;</em>\</code>
    </p>
  </>);
}

function LinuxFilePaths({ subpath }: PathsProps) {
  const translate = useContext(TranslationContext);
  return (<>
    <dl className="FileEditor__pathlist">
      <dt><Icon id="file_cloud" size={28} alt="" /> {translate('ui.fileEditor.type.cloud')}</dt>
      <dd><code>~/.local<wbr/>/share<wbr/>/Steam<wbr/>/userdata<wbr/>/<em title={translate('ui.fileEditor.steamIdNote')}>&lt;steam-id&gt;</em><wbr/>/892970<wbr/>/{subpath}</code></dd>
      <dt><Icon id="file_local" size={28} alt="" /> {translate('ui.fileEditor.type.local')}</dt>
      <dd><code>/home/<wbr/>steam/<wbr/>.config/<wbr/>unity3d/<wbr/>IronGate/<wbr/>Valheim/<wbr/>{subpath}_local</code></dd>
      <dt><Icon id="file_legacy" size={28} alt="" /> {translate('ui.fileEditor.type.legacy')}</dt>
      <dd><code>/home<wbr/>/steam<wbr/>/.config<wbr/>/unity3d<wbr/>/IronGate<wbr/>/Valheim<wbr/>/{subpath}</code></dd>
    </dl>
    <p>Files are visible only by <code>steam</code> user, use <code>chmod</code> or <code>su</code> commands if needed</p>
  </>);
}

export function FileSelector({ ext, subpath, state, processFiles }: {
  ext: string;
  subpath: string;
  state: EmptyState;
  processFiles: (files: FileList | null) => Promise<void>
}) {
  const translate = useContext(TranslationContext);
  const selectedTabIndex = navigator.userAgent.includes('Linux') ? 2 : 0;

  return <>
    {state.message ? <p className="warning">{state.message}</p> : null}
    <p>{translate('ui.fileEditor.initial', ext)}</p>
    <p><input type="file"
      accept={`.${ext},.${ext}.old`}
      onChange={e => processFiles(e.target.files)} /></p>
    <p>{translate('ui.fileEditor.pathComment')}</p>
    <Tabs tabs={[
      {
        title: <><GameStoreIcon type="steam" /> Steam</>,
        renderer: () => <SteamFilePaths subpath={subpath} />,
      },
      {
        title: <><GameStoreIcon type="xbox" /> GamePass</>,
        renderer: () => <GamePassFilePaths subpath={subpath} />,
      },
      {
        title: 'Linux',
        renderer: () => <LinuxFilePaths subpath={subpath} />,
      },
    ]} selected={selectedTabIndex} />
    <p className='info'>{translate('ui.fileEditor.localNote')}</p>
  </>
}
