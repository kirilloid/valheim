import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import '../css/Search.css';

import { DamageType, EntityId, Piece } from '../types';
import { match } from '../model/search';
import { Icon } from './Icon';
import { data } from '../model/objects';
import { useTranslation } from '../translation.effect';
import { assertNever } from '../model/utils';
import { creatures } from '../model/creatures';
import { SkillType } from '../model/skills';
import { shortWeaponDamage } from './helpers';
import { take } from '../model/iter';

function first(val: number | [number, number]) {
  if (typeof val === 'number') return val;
  return val[0];
}

function resistIcon(id: DamageType) {
  switch (id) {
    case DamageType.Fire:
      return <Icon type="icon" id="fire" size={16} />
    case DamageType.Frost:
      return <Icon type="icon" id="frost" size={16} />
    case DamageType.Poison:
      return <Icon type="icon" id="poison" size={16} />
    case DamageType.Lightning:
      return <Icon type="icon" id="lightning" size={16} />
    default:
      return null;
  }
}

function pieceExtra(item: Piece) {
  switch (item.subtype) {
    case 'bed':
    case 'chair':
    case 'decoration':
    case 'fireplace':
    case 'table':
      return item.comfort?.value ? <span>
        <Icon type="icon" id="health_icon_walknut_small" size={16} />
        {' '}
        {item.comfort.value}
      </span> : null
    case 'craft':
    case 'craft_ext':
      return <Icon type="icon" id="hammer" size={32} />
    case 'chest':
    case 'door':
    case 'misc':
    case 'stand':
    case 'structure':
      return null;
    default:
      return assertNever(item);
  }
}

function renderItem(id: EntityId, text: string, onClick: React.MouseEventHandler) {
  const item = data[id] ?? creatures.find(c => c.id === id);
  if (!item) { return "Something went wrong" }
  switch (item?.type) {
    case 'creature':
      return <div className="SearchItem">
        <Icon type="creature" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon type="icon" id="health_icon" size={16} />
          {item.hp}
        </span>
      </div>
    case 'item':
      return <div className="SearchItem">
        <Icon type="resource" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {item.summon
        ? <Icon type="creature" id={item.summon} size={32} />
        : item.id.startsWith('Trophy')
        ? <Icon type="icon" id="trophies_20" size={20} />
        : null}
      </div>
    case 'tool':
      return <div className="SearchItem">
        <Icon type="weapon" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
      </div>
    case 'weap':
      return <div className="SearchItem">
        <Icon type="weapon" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {item.skill === SkillType.Blocking
          ? <span>
              <Icon type="skills" id="Blocking" size={16} />
              {first(item.block)}
            </span>
          : <span>{shortWeaponDamage(item.damage[0])}</span>}
      </div>
    case 'armor':
      return <div className="SearchItem">
        <Icon type="armor" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon type="icon" id="ac_bkg" size={16} />
          {first(item.armor)}
        </span>
      </div>
    case 'ammo':
      return <div className="SearchItem">
        <Icon type="arrow" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          {shortWeaponDamage(item.damage)}
        </span>
      </div>
    case 'food':
      return <div className="SearchItem">
        <Icon type="resource" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon type="icon" id="health_icon" size={16} />
          {item.health}
          <Icon type="icon" id="health_icon_walknut_small" size={16} />
          {item.stamina}
        </span>
      </div>
    case 'potion':
      return <div className="SearchItem">
        <Icon type="resource" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          {item.health
            ? <>
                <Icon type="icon" id="health_icon" size={16} />
                {item.health[0]} / {item.health[1]}s
              </>
            : null}
          {item.stamina
            ? <>
                <Icon type="icon" id="health_icon_walknut_small" size={16} />
                {item.stamina[0]} / {item.stamina[1]}s
              </>
            : null}
          {item.resist
            ? item.resist.map(resistIcon)
            : null}
        </span>
      </div>
    case 'value':
      return <div className="SearchItem">
        <Icon type="resource" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon type="icon" id="coin_32" size={16} />
          {item.value}
        </span>
      </div>
    case 'tool':
      return <div className="SearchItem">
        <Icon type="weapon" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
      </div>
    case 'piece':
      return <div className="SearchItem">
        <Icon type="piece" id={id} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {pieceExtra(item)}
      </div>
    default:
      assertNever(item);
  }
}

export const Search = () => {
  const history = useHistory();
  const [items, setItems] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const translate = useTranslation();
  const updateSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setItems([...take(20, match(str))]);
  }, [setItems]);
  const clearSearch = useCallback(() => {
    setItems([]);
  }, [setItems]);
  function updateIndex(e: KeyboardEvent<HTMLInputElement>) {
    const len = items.length; 
    if (len === 0) return;
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        setIndex((index - 1 + len) % len);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setIndex((index + 1) % len);
        break;
      case 'Enter':
        e.preventDefault();
        const path = `/obj/${items[index]}`;
        clearSearch();
        history.push(path);
        break;
    }
  }
  
  useEffect(() => {
    document.getElementById(`gs_i${index}`)?.scrollIntoView(false);
  }, [items, index]);

  return (
    <div className="SearchBlock">
      <div className="SearchControls">
        <input type="search"
          className="SearchControls_Input"
          placeholder={translate('ui.search.placeholder')}
          onChange={updateSearch}
          onKeyDown={updateIndex} />
        <input type="submit" value={translate('ui.search.button')} />
      </div>
      {items.length
      ? <ul className="SearchResults" aria-activedescendant={`gs_i${index}`}>
          {items.map((id, i) => {
            const text = translate(id);
            return (
              <li id={`gs_i${i}`} key={id}
                className={i === index ? 'active' : ''}
                tabIndex={0}>
                {renderItem(id, text, clearSearch)}
              </li>
            );
          })}
        </ul>
      : null}
    </div>
  );
};
