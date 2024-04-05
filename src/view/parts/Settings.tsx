import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import '../../css/TopBar.css';

import { biomes } from '../../data/location';

import { Icon } from './Icon';
import { languages, TranslationContext, useLanguage } from '../../effects/translation.effect';
import { useGlobalState } from '../../effects';

export function Settings() {
  const translate = useContext(TranslationContext);
  const { lang, setLang } = useLanguage();
  const [spoiler, setSpoiler] = useGlobalState('spoiler');
  const [mods, setMods] = useGlobalState('searchInMods');
  const [disabled, setDisabled] = useGlobalState('searchInDisabled');
  const [theme, setTheme] = useGlobalState('theme');
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    const options = { capture: false, passive: true };
    if (isOpen) {
      document.addEventListener('keydown', callback, options);
      return () => document.removeEventListener('keydown', callback, options);
    }
  }, [isOpen]);
  return <>
    <button className="btn btn--sm" style={{ verticalAlign: 'bottom' }} onClick={() => {
      setIsOpen(open => !open);
    }}>
      <Icon id="wrench" size={16} alt="settings" />
    </button>
    <div className="Dialog" hidden={!isOpen}>
      <div className="Dialog__header">Settings</div>
      <div className="Dialog__body">
        <h2>Preferences</h2>
        <dl>
          <dt className="Dialog__row"><label htmlFor="language">{translate('ui.language')}</label></dt>
          <dd className="Dialog__row"><select id="language" value={lang} onChange={e => setLang(e.target.value)}>
            {Object.entries(languages)
              .map(([code, langName]) => <option key={code} value={code}>
                {langName}
              </option>)
            }
          </select></dd>
          <dt className="Dialog__row"><label htmlFor="theme">{translate('ui.theme')}</label></dt>
          <dd className="Dialog__row">
            <select id="theme" value={theme} onChange={e => setTheme(e.target.value as any)}>
              <option value="system">{translate('ui.theme.system')}</option>
              <option value="light">{translate('ui.theme.light')}</option>
              <option value="dark">{translate('ui.theme.dark')}</option>
            </select>
          </dd>
        </dl>
        <h2>Content</h2>
        <dl>
          <dt className="Dialog__row"><label htmlFor="spoiler">tiers</label></dt>
          <dd className="Dialog__row">
            <select id="spoiler" value={spoiler}
              onChange={e => setSpoiler(Number(e.target.value))}>
              {biomes.map(biome => <option key={biome.id} value={biome.tier}>{translate(`ui.biome.${biome.id}`)}</option>)}
              <option key="all" value={999}>All</option>
            </select>
          </dd>
          <dt className="Dialog__row"><label htmlFor="hidden">hidden</label></dt>
          <dd className="Dialog__row">
            <input id="hidden" type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />
            {' '}
            items not normally available
          </dd>
          <dt className="Dialog__row"><label htmlFor="mods">mods</label></dt>
          <dd className="Dialog__row">
            <input id="mods" type="checkbox" checked={mods} onChange={e => setMods(e.target.checked)} />
            {' '}
            see <Link to="/mods">mods</Link> for details
          </dd>
        </dl>
      </div>
      <div className="Dialog__buttons">
        <input type="button" value="Close" className="Dialog__button btn" onClick={() => setIsOpen(false)} />
      </div>
    </div>
  </>
}

