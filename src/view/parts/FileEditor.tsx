import React, { useState, useCallback, useContext } from 'react';
import classNames from 'classnames';

import '../../css/FileEditor.css';

import type { Reader, Writer, EditorProps } from './types';

import { assertNever, getMemUsage, runGenerator } from '../../model/utils';
import { downloadFile } from '../helpers';
import { Tabs } from './Tabs';
import { TranslationContext } from '../../effects';

type Props<T> = {
  defaultFileName: string;
  extension: string;
  reader: Reader<T>;
  writer: Writer<T>;
  Child: React.FC<EditorProps<T>>;
  subpath: 'worlds' | 'characters';
};

type FileState<T> =
| { state: 'empty', message?: string }
| { state: 'picking', files: File[] }
| { state: 'reading', file: File, progress: number }
| { state: 'done', file: File, value: T, changed: boolean }
| { state: 'saving', file: File, value: T, progress: number };

type PathsProps = { subpath: string };

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
  return (
    <dl className="FileEditor__pathlist">
      <dt>{translate('ui.fileEditor.type.local')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}_local</code></dd>
      <dt>{translate('ui.fileEditor.type.cloud')}</dt>
      <dd><code>%ProgramFiles(x86)%\<wbr/>Steam\<wbr/><em>&lt;steam-id&gt;</em>\<wbr/>892970\<wbr/>{subpath}</code></dd>
      <dt>{translate('ui.fileEditor.type.legacy')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}</code></dd>
    </dl>
  );
}

function GamePassFilePaths({ subpath }: PathsProps) {
  const translate = useContext(TranslationContext);
  return (
    <dl className="FileEditor__pathlist">
      <dt>{translate('ui.fileEditor.type.local')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}_local</code></dd>
      <dt>{translate('ui.fileEditor.type.cloud')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>Local\<wbr/>Packages\<wbr/>CoffeeStainStudios.Valheim_496a1srhmar9w\<wbr/>SystemAppData\<wbr/>wgs</code></dd>
      <dt>{translate('ui.fileEditor.type.legacy')}</dt>
      <dd><code>%userprofile%\<wbr/>AppData\<wbr/>LocalLow\<wbr/>IronGate\<wbr/>Valheim\<wbr/>{subpath}</code></dd>
    </dl>
  );
}

function LinuxFilePaths({ subpath }: PathsProps) {
  const translate = useContext(TranslationContext);
  return (<>
    <dl className="FileEditor__pathlist">
      <dt>{translate('ui.fileEditor.type.local')}</dt>
      <dd><code>/home/<wbr/>steam/<wbr/>.config/<wbr/>unity3d/<wbr/>IronGate/<wbr/>Valheim/<wbr/>{subpath}_local</code></dd>
      <dt>{translate('ui.fileEditor.type.cloud')}</dt>
      <dd><code>~/.local<wbr/>/share<wbr/>/Steam<wbr/>/userdata<wbr/>/<em>&lt;steam-id&gt;</em><wbr/>/892970<wbr/>/{subpath}</code></dd>
      <dt>{translate('ui.fileEditor.type.legacy')}</dt>
      <dd><code>/home<wbr/>/steam<wbr/>/.config<wbr/>/unity3d<wbr/>/IronGate<wbr/>/Valheim<wbr/>/{subpath}</code></dd>
    </dl>
    <p>Files are visible only by <code>steam</code> user</p>
  </>);
}

export function FileEditor<T>(props: Props<T>) {
  const translate = useContext(TranslationContext);
  const [state, setState] = useState<FileState<T>>({ state: 'empty' });
  const [dragging, setDragging] = useState(false);
  const ext = props.extension;
  const { reader } = props;

  const processFile = useCallback(async (file: File) => {
    // sometimes people click on image in content and drag it
    if (file.type.startsWith('image/')) return;

    const buffer = await file.arrayBuffer();
    setState({ state: 'reading', file, progress: 0 });
    const value = await runGenerator(
      reader(new Uint8Array(buffer)),
      progress => setState({ state: 'reading', file, progress })
    );
    setState({ state: 'done', file, value, changed: false });
    const mem = getMemUsage();
    const memStr = mem >= 512
      ? (mem / 1024).toPrecision(3) + ' GB'
      : mem.toPrecision(3) + ' MB';
    console.info('Memory used: ' + memStr);
  }, [setState, reader]);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (files == null) {
      return setState({ state: 'empty', message: translate('ui.fileEditor.noFile') });
    }
    const allFiles = [...files];
    const matchingFiles = allFiles.filter(
      file => file.name.endsWith(`.${ext}`)
           || file.name.endsWith(`.${ext}.old`)
    );
    if (matchingFiles.length > 1) return setState({ state: 'picking', files: matchingFiles });
    if (matchingFiles.length === 1) return processFile(matchingFiles[0]!);
    if (allFiles.length === 0) {
      return setState(state => state.state === 'done'
        ? state
        : { state: 'empty', message: translate('ui.fileEditor.noFile') }
      );
    }
    if (!window.confirm(translate('ui.fileEditor.wrongExtensionWarning'))) {
      return;
    }
    if (allFiles.length === 1) {
      processFile(allFiles[0]!);
    } else {
      setState({ state: 'picking', files: allFiles });
    }
  }, [ext, processFile, translate]);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    processFiles(event.dataTransfer.files);
  }, [processFiles]);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    const { items } = event.dataTransfer;
    if (items.length > 0 && items[0]?.kind === 'file') {
      event.preventDefault();
      setDragging(true);
    }
  }, []);

  const onDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const onChange = useCallback((value: T) => {
    setState(
      state => state.state === 'empty' || state.state === 'picking'
      ? state
      : { state: 'done', file: state.file, value, changed: true }
    )
  }, [setState]);

  return <div className={classNames('drop', { 'drop--over': dragging })}
    onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}>
    {function () {
      switch (state.state) {
        case 'empty':
          return <>
            <p>{translate('ui.fileEditor.initial', ext)}</p>
            <p><input type="file"
              accept={`.${ext},.${ext}.old`}
              onChange={e => processFiles(e.target.files)} /></p>
          <p>{translate('ui.fileEditor.pathComment')}</p>
            <Tabs tabs={[
              {
                title: <><GameStoreIcon type="steam" /> Steam</>,
                renderer: () => <SteamFilePaths subpath={props.subpath} />,
              },
              {
                title: <><GameStoreIcon type="xbox" /> GamePass</>,
                renderer: () => <GamePassFilePaths subpath={props.subpath} />,
              },
              {
                title: 'Linux',
                renderer: () => <LinuxFilePaths subpath={props.subpath} />,
              },
            ]} selected={0} />
          </>
        case 'picking':
          return <>
            <div>{translate('ui.fileEditor.multiFiles')}</div>
            {state.files.map((f, i) => <p key={f.name}>
              <button type="button" className="btn btn--secondary" onClick={() => processFile(f)}>{f.name}</button>
            </p>)}
            <input type="button" className="btn btn--danger" onClick={() => setState({ state: 'empty' })} value="cancel" />
          </>
        case 'reading':
          return <>
            <div>{translate('ui.fileEditor.reading')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
          </>
        case 'done':
          return <>
            <div className="FileEditor__controls">
              <button className="btn btn--primary" disabled={!state.changed}
                onClick={() => {
                  const sizeHint = Math.round(state.file.size * 1.1);
                  const { file } = state;
                  runGenerator(
                    props.writer(state.value, sizeHint),
                    progress => setState({ state: 'saving', file, value: state.value, progress }),
                  ).then(result => {
                    downloadFile(result, file.name);
                    setState({ state: 'done', file, value: state.value, changed: false });
                  });
                }}>
                {translate('ui.fileEditor.save')}
              </button>
              <button className="btn btn--danger"
                onClick={() => setState({ state: 'empty' })}>
                {translate('ui.fileEditor.close')}
              </button>
            </div>
            <props.Child value={state.value} file={state.file} onChange={onChange} />
          </>;
        case 'saving':
          return <>
            <div>{translate('ui.fileEditor.saving')} &hellip;</div>
            <progress value={state.progress} max="1" style={{ width: '100%' }} />
            <props.Child value={state.value} file={state.file} onChange={onChange} disabled={true} />
          </>;
        default:
          return assertNever(state);
      }
    }()}
  </div>
}