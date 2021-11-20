import { useContext, useEffect, useState } from 'react';

import '../../css/TopBar.css';

import { Search } from '../Search';
import { Icon } from './Icon';
import { languages, TranslationContext, useLanguage } from '../../effects/translation.effect';
import { useGlobalState } from '../../effects';
import { biomes } from '../../data/location';
import { Link } from 'react-router-dom';

function Settings() {
  const translate = useContext(TranslationContext);
  const { lang, setLang } = useLanguage();
  const [spoiler, setSpoiler] = useGlobalState('spoiler');
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
        <dl>
          <dt className="Dialog__row"><label htmlFor="language">{translate('ui.language')}</label></dt>
          <dd className="Dialog__row"><select id="language" value={lang} onChange={e => setLang(e.target.value)}>
            {Object.entries(languages)
              .map(([code, langName]) => <option key={code} value={code}>
                {langName}
              </option>)
            }
          </select></dd>
          <dt className="Dialog__row"><label htmlFor="spoiler">spoiler</label></dt>
          <dd className="Dialog__row"><select id="spoiler" value={spoiler} onChange={e => setSpoiler(Number(e.target.value))}>
            {biomes.map(biome => <option key={biome.id} value={biome.tier}>{translate(`ui.biome.${biome.id}`)}</option>)}
            <option key="all" value={999}>All</option>
          </select></dd>
        </dl>
      </div>
      <div className="Dialog__buttons">
        <input type="button" value="Close" className="Dialog__button btn" onClick={() => setIsOpen(false)} />
      </div>
    </div>
  </>
}

export function TopBar() {
  return <div className="TopBar">
    <div className="TopBar__home">
      <Link to="/" className="btn btn--sm">
        <Icon id="house" size={16} alt="home" style={{ verticalAlign: 'text-bottom' }} />
      </Link>
    </div>
    <div className="TopBar__search">
      <Search />
    </div>
    <div className="TopBar__settings">
      <Settings />
    </div>
  </div>
}
