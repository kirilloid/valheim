import React, { ChangeEvent, KeyboardEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../css/Search.css';

import type { Item } from '../types';
import { match } from '../model/search';
import { Icon } from './Icon';
import data from '../model/objects';
import { useTranslation } from '../translation.effect';

function typeToIcon(type?: Item['type']): string {
  switch (type) {
    case undefined: return 'creatures';
    case 'item': return 'resources';
    case 'food': return 'resources';
    case 'value': return 'resources';
    case 'weap': return 'weapon';
    case 'ammo': return 'arrow';
    default: return type;
  }
}

export const Search = () => {
  const history = useHistory();
  const [items, setItems] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const translate = useTranslation();
  function updateSearch(e: ChangeEvent<HTMLInputElement>) {
    const str = e.target.value;
    setItems(match(str));
  }
  function updateIndex(e: KeyboardEvent<HTMLInputElement>) {
    const len = items.length; 
    if (len === 0) return;
    switch (e.key) {
      case 'ArrowUp':
        setIndex((index - 1 + len) % len);
        break;
      case 'ArrowDown':
        setIndex((index + 1) % len);
        break;
      case 'Enter':
        const path = `/obj/${items[index]}`;
        history.push(path);
        break;
    }
  }
  return (
    <div className="SearchBlock">
      <form>
        <input type="search"
          className="GlobalSearch"
          placeholder={translate('ui.search.placeholder')}
          onChange={updateSearch}
          onKeyUp={updateIndex} />
        <input type="submit" value={translate('ui.search.button')} />
      </form>
      {items.length
      ? <ul className="SearchResults" aria-activedescendant={`gs_i${index}`}>
          {items.map((id, i) => {
            const text = translate(id);
            const type = typeToIcon(data[id]?.type);
            return (
              <li id={`gs_i${i}`} key={id}
                className={i === index ? 'active' : ''}
                tabIndex={0}>
                <Icon type={type} id={id} size={32} />
                <Link to={`/obj/${id}`} tabIndex={-1}>
                  {text}
                </Link>
              </li>
            );
          })}
        </ul>
      : null}
    </div>
  );
};
