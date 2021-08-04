import React, { ChangeEvent, KeyboardEvent, useCallback, useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createSelector } from 'reselect';

import '../css/Search.css';

import { DamageType, EntityId, GameObject, ItemSpecial, Piece } from '../types';
import { match, SearchEntry } from '../model/search';
import { Icon, ItemIcon, SkillIcon } from './Icon';
import { data } from '../model/objects';
import { TranslationContext, Translator } from '../effects';
import { assertNever, days, timeI2S } from '../model/utils';
import { SkillType } from '../model/skills';
import { averageAttacksDamage, ShortWeaponDamage } from './helpers';
import { getCraftingStationId } from '../model/building';
import { events } from '../model/events';

function first(val: number | [number, number]) {
  if (typeof val === 'number') return val;
  return val[0];
}

function resistIcon(translate: Translator, type: DamageType) {
  switch (type) {
    case 'fire':
    case 'frost':
    case 'poison':
    case 'lightning':
      return <Icon id={type} alt={translate(`ui.damageType.${type}`)} size={16} />
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
        <Icon id="walknut" alt="comfort" size={16} />
        {' '}
        {item.comfort.value}
      </span> : null
    case 'craft':
      return <Icon id="hammer" alt="crafting" size={32} />
    case 'craft_ext':
      const id = getCraftingStationId(item.extends.id);
      return <ItemIcon useAlt item={data[id]} size={32} />
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

function showSpecialIcon(special: ItemSpecial, translate: Translator) {
  switch (special) {
    case undefined: return null;
    case 'light': return <Icon id="flashlight" alt="flashlight" size={16} />;
    case 'strength': return <span><Icon id="weight" alt={translate('ui.weight')} size={16} />+150</span>;
    case 'search': return <Icon id="map_ping" alt="search" size={16} />;
    case 'harpoon': return <Icon id="harpoon" alt="harpoon" size={16} />;
    case 'build': return null;
    case 'garden': return <Icon path="piece/replant" alt="gardening" size={32} />;
    case 'ground': return <Icon path="piece/raise" alt="terraforming" size={32} />;
    case 'fishing': return null;
    default: return assertNever(special);
  }
}

function renderItem(entry: SearchEntry, text: string, translate: Translator, onClick: React.MouseEventHandler) {
  switch (entry.type) {
    case 'obj': return renderObject(entry.id, text, translate, onClick);
    case 'page': return renderLink('/', entry, text, onClick);
    case 'loc': return renderLink('/loc/', entry, text, onClick);
    case 'biome': return renderLink('/biome/', entry, text, onClick);
    case 'event': return renderEvent(entry.id, text, translate, onClick);
    default: return assertNever(entry.type);
  }
}

function renderLink(path: string, entry: SearchEntry, text: string, onClick: React.MouseEventHandler) {
  const { id } = entry;
  return <Link to={`${path}${id}`} onClick={onClick}>{text}</Link>
}

function Materials(props: { materials: Record<EntityId, number> }) {
  const { materials } = props;
  const maxTier = Object.keys(materials).reduce((a, id) => Math.max(a, data[id]?.tier ?? 0), 0);
  return <span className="SearchItem__recipe">
    {Object
      .entries(materials)
      .filter(([key]) => (data[key]?.tier ?? 0) >= maxTier - 2)
      .flatMap(([key, val]) => [
        ' ',
        <ItemIcon key={key} item={data[key]} size={16} />,
        String(val),
      ])}
  </span>
}

function ShortRecipe(props: { item: GameObject }) {
  const { item } = props;
  switch (item.type) {
    case 'creature':
    case 'destructible':
    case 'plant':
    case 'item':
    case 'trophy':
    case 'valuable':
      return null;
    case 'piece':
    case 'ship':
    case 'cart':
    case 'food':
    case 'shield':
    case 'tool':
    case 'armor':
    case 'ammo':
    case 'potion':
    case 'weapon': {
      const { recipe } = item;
      if (recipe == null) return null;
      switch (recipe.type) {
        case 'craft_one':
        case 'craft_piece':
        case 'craft_upg':
          // disabled for now
          return <Materials materials={recipe.materials} />
        case 'trader':
          // disabled for now
          return null && <span><Icon id="coin" alt="" size={16} /> {recipe.value}</span>
        default:
          return assertNever(recipe);
      }
    }
    default:
      return assertNever(item);
  }
}

function renderEvent(id: EntityId, text: string, translate: Translator, onClick: React.MouseEventHandler) {
  const event = events.find(e => e.id === id)!;
  return <div className="SearchItem">
    <ItemIcon item={data[event.icon]} size={32} />
    <Link to={`/event/${id}`} onClick={onClick}>{text}</Link>
    <span>
      {event.spawns.map(s => <ItemIcon item={data[s.id]} useAlt />)}
      {' '}
      <Icon id="time" alt={translate('ui.time')} size={16} />
      {' '}
      {timeI2S(event.duration)} 
    </span>
  </div>  
}

function renderObject(id: EntityId, text: string, translate: Translator, onClick: React.MouseEventHandler) {
  const item = data[id];
  if (!item) {
    return <span className="danger">Item "{id}" appears in search index, but missing from the main DB</span>
  }
  switch (item.type) {
    case 'creature': {
      const { hp } = item;
      const avgDmg = averageAttacksDamage(item);
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="health" alt={translate('ui.health')} size={16} />
          {hp < 2000 ? hp : (hp / 1000) + 'k'}
          {avgDmg ? <> 
            <Icon id="sword" alt={translate('ui.damage')} size={16} />
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
        ? <ItemIcon item={data[item.summon[0]]} useAlt size={32} />
        : item.grow?.respawn
        ? <span>{days(item.grow.respawn)} <Icon id="time" alt={translate('ui.time')} size={16} /></span>
        : null}
      </div>
    case 'trophy':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {item.summon
        ? <ItemIcon item={data[item.summon[0]]} useAlt size={32} />
        : <Icon id="trophies" size={20} alt="" />}
      </div>
    case 'tool':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {showSpecialIcon(item.special, translate)}
        <ShortRecipe item={item} />
      </div>
    case 'weapon':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {showSpecialIcon(item.special, translate) ?? <ShortWeaponDamage damage={item.damage[0]} skill={item.skill} />}
        <ShortRecipe item={item} />
      </div>
    case 'shield':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <SkillIcon skill={SkillType.Blocking} useAlt size={16} />
          {first(item.block)}
        </span>
        <ShortRecipe item={item} />
      </div>
    case 'armor':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>{
          showSpecialIcon(item.special, translate) ??
          <>
            <Icon id="armor" alt={translate('ui.armor')} size={16} />
            {first(item.armor)}
          </>
        }</span>
        <ShortRecipe item={item} />
      </div>
    case 'ammo':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span><ShortWeaponDamage damage={item.damage} skill={SkillType.Bows} /></span>
        <ShortRecipe item={item} />
      </div>
    case 'food':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="health" alt={translate('ui.health')} size={16} />
          {item.health}
          <Icon id="walknut" alt={translate('ui.stamina')} size={16} />
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
                <Icon id="health" alt={translate('ui.health')} size={16} />
                {item.health[0]} / {item.health[1]}s
              </>
            : null}
          {item.stamina
            ? <>
                <Icon id="walknut" alt={translate('ui.stamina')} size={16} />
                {item.stamina[0]} / {item.stamina[1]}s
              </>
            : null}
          {item.resist
            ? (Object.keys(item.resist) as DamageType[]).map(type => resistIcon(translate, type))
            : null}
        </span>
        <ShortRecipe item={item} />
      </div>
    case 'valuable':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="coin" alt={translate('Coins')} size={32} />
          {item.value}
        </span>
      </div>
    case 'plant':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          {days(item.growTime[0]).toFixed(1)}
          –
          {days(item.growTime[1]).toFixed(1)}
          {' '}
          <Icon id="time" alt={translate('ui.time')} size={16} />
        </span>
      </div>
    case 'destructible':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
      </div>
    case 'piece':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        {pieceExtra(item)}
        <ShortRecipe item={item} />
      </div>
    case 'ship':
    case 'cart':
      return <div className="SearchItem">
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick}>{text}</Link>
        <span>
          <Icon id="weight" alt={translate('ui.weight')} size={16} />
          {item.storage[0] * item.storage[1]}
        </span>
      </div>
    default:
      assertNever(item);
  }
}

const PER_PAGE = 30;

const searchSelector = createSelector((term: string) => term, (term: string) => [...match(term)]);
const arraySliceSelector = createSelector(
  ({ items }: { items: SearchEntry[] }) => items,
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
  }, [lastItem, items, loadMore]);

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
        const item = items[index];
        if (!item) break;
        const { id, path } = item;
        clearSearch();
        history.push(path + id);
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
      </div>
      {items.length
      ? <ul className="SearchResults" aria-activedescendant={`gs_i${index}`}>
          {itemsToDisplay.map((entry, i) => {
            const text = translate(entry.i18nKey);
            return (
              <li id={`gs_i${i}`} key={`${entry.type}_${entry.id}`}
                className={i === index ? 'active' : ''}
                tabIndex={0}>
                {renderItem(entry, text, translate, clearSearch)}
              </li>
            );
          })}
          {len < items.length ? <li key="#last-item"><Icon id="hammer_spinner" alt="loading"/></li> : null}
        </ul>
      : null}
    </div>
  );
};
