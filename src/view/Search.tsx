import React, { ChangeEvent, KeyboardEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createSelector } from 'reselect';

import '../css/Search.css';

import { DamageType, EntityId, ItemSpecial, Piece } from '../types';
import { match } from '../model/search';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { data } from '../model/objects';
import { TranslationContext } from '../translation.effect';
import { assertNever } from '../model/utils';
import { creatures } from '../model/creatures';
import { SkillType } from '../model/skills';
import { averageAttacksDamage, ShortWeaponDamage } from './helpers';
import { getCraftingStationId } from '../model/building';

function first(val: number | [number, number]) {
  if (typeof val === 'number') return val;
  return val[0];
}

function resistIcon(id: DamageType) {
  switch (id) {
    case DamageType.Fire:
      return <Icon id="fire" size={16} />
    case DamageType.Frost:
      return <Icon id="frost" size={16} />
    case DamageType.Poison:
      return <Icon id="poison" size={16} />
    case DamageType.Lightning:
      return <Icon id="lightning" size={16} />
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
        <Icon id="walknut_16" size={16} />
        {' '}
        {item.comfort.value}
      </span> : null
    case 'craft':
      return <Icon id="hammer" size={32} />
    case 'craft_ext':
      const id = getCraftingStationId(item.extends.id);
      return <ItemIcon item={data[id]} size={32} />
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

function showSpecialIcon(special: ItemSpecial) {
  switch (special) {
    case undefined: return null;
    case 'light': return <Icon id="flashlight" size={16} />;
    case 'strength': return <span><Icon id="weight" size={16} />+150</span>;
    case 'search': return <Icon id="map_ping" size={16} />;
    case 'harpoon': return <Icon id="harpoon" size={16} />;
    case 'build': return null;
    case 'garden': return <Icon path="piece/replant" size={32} />;
    case 'ground': return <Icon path="piece/raise" size={32} />;
    case 'fishing': return <ItemIcon item={data.FishingBait} size={32} />;
    default: return assertNever(special);
  }
}

function renderItem(id: EntityId, text: string, onClick: React.MouseEventHandler) {
  const item = data[id];
  if (!item) { return "Something went wrong" }
  switch (item?.type) {
    case 'creature': {
      const { hp } = item;
      const avgDmg = averageAttacksDamage(item.attacks);
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="health" size={16} />
          {hp < 2000 ? hp : (hp / 1000) + 'k'}
          {avgDmg ? <> 
            <Icon id="sword" size={16} />
            {avgDmg}
          </> : null}
        </span>
      </div>
    }
    case 'item':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {item.summon
        ? <ItemIcon item={data[item.summon[0]]} size={32} />
        : null}
      </div>
    case 'trophy':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {item.summon
        ? <ItemIcon item={data[item.summon[0]]} size={32} />
        : <Icon id="trophies_20" size={20} />}
      </div>
    case 'tool':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {showSpecialIcon(item.special)}
      </div>
    case 'weapon':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span><ShortWeaponDamage damage={item.damage[0]} skill={item.skill} /></span>
      </div>
    case 'shield':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <SkillIcon skill={SkillType.Blocking} size={16} />
          {first(item.block)}
        </span>
      </div>
    case 'armor':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>{
          showSpecialIcon(item.special) ??
          <><Icon id="ac_bkg" size={16} />
          {first(item.armor)}</>
        }</span>
      </div>
    case 'ammo':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span><ShortWeaponDamage damage={item.damage} skill={SkillType.Bows} /></span>
      </div>
    case 'food':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="health" size={16} />
          {item.health}
          <Icon id="walknut_16" size={16} />
          {item.stamina}
        </span>
      </div>
    case 'potion':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          {item.health
            ? <>
                <Icon id="health" size={16} />
                {item.health[0]} / {item.health[1]}s
              </>
            : null}
          {item.stamina
            ? <>
                <Icon id="walknut_16" size={16} />
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
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="coin_32" size={16} />
          {item.value}
        </span>
      </div>
    case 'piece':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {pieceExtra(item)}
      </div>
    default:
      assertNever(item);
  }
}

const PER_PAGE = 30;

const searchSelector = createSelector((term: string) => term, (term: string) => [...match(term)]);
const arraySliceSelector = createSelector(
  ({ items }: { items: string[] }) => items,
  ({ len }: { len: number }) => len,
  (items, len) => items.slice(0, len),
);

export const Search = () => {
  const history = useHistory();
  const translate = useContext(TranslationContext);

  const [len, setLen] = useState(0);
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const items = searchSelector(searchTerm);
  const itemsToDisplay = arraySliceSelector({ items, len });
  const [lastItem, setLastItem] = useState<Element | null>(null);

  const updateSearch = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, [setSearchTerm]);

  const loadMore = useCallback(() => {
    const newLoaded = Math.min(len + PER_PAGE, items.length);
    setLen(newLoaded);
  }, [items, len]);

  useEffect(() => {
    const lastItem = document.querySelector('.SearchResults .SearchItem:last-child');
    setLastItem(lastItem);
    if (!lastItem) {
      loadMore();
      return;
    }
    let options = { root: null, rootMargin: '0px', threshold: 0, };
    let observer = new IntersectionObserver(loadMore, options);
    observer.observe(lastItem);
    return () => {
      observer.unobserve(lastItem);
    }
  }, [lastItem, items]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setLen(0);
  }, [setSearchTerm, setLen]);

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
          onKeyDown={updateIndex}
          value={searchTerm} />
        <input type="submit" value={translate('ui.search.button')} />
      </div>
      {items.length
      ? <ul className="SearchResults" aria-activedescendant={`gs_i${index}`}>
          {itemsToDisplay.map((id, i) => {
            const text = translate(id);
            return (
              <li id={`gs_i${i}`} key={id}
                className={i === index ? 'active' : ''}
                tabIndex={0}>
                {renderItem(id, text, clearSearch)}
              </li>
            );
          })}
          {len < items.length ? <li key="#last-item"><Icon id="hammer_spinner"/></li> : null}
        </ul>
      : null}
    </div>
  );
};
