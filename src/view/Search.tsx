import React, { ChangeEvent, KeyboardEvent, useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { createSelector } from 'reselect';

import '../css/Search.css';

import { DamageType, EntityId, GameObject, ItemSpecial, Piece, Resource } from '../types';
import { SkillType } from '../model/skills';
import { assertNever, days, groupBy, timeI2S } from '../model/utils';
import type { SearchEntry } from '../model/search';

import { match } from '../data/search';
import { data } from '../data/itemDB';
import { recipes } from '../data/recipes';
import { events } from '../data/events';
import { biomes, locationsTypeIdMap } from '../data/location';
import { effects } from '../data/effects';
import { biome } from '../data/emoji';

import { TranslationContext, Translator, useGlobalState } from '../effects';
import { averageAttacksDamage, findDropChanceFromCreature, itemClasses, List, Materials, ShortWeaponDamage } from './helpers';
import { EffectIcon, Icon, ItemIcon, SkillIcon } from './parts/Icon';

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
      return <Icon key={type} id={type} alt={translate(`ui.damageType.${type}`)} size={16} />
    default:
      return null;
  }
}

function pieceExtra(item: Piece, translate: Translator) {
  switch (item.subtype) {
    case 'bed':
    case 'chair':
    case 'decoration':
    case 'fireplace':
    case 'table':
      return item.comfort?.value ? <span>
        <Icon id="walknut" alt={translate('ui.comfort')} size={16} />
        {' '}
        {item.comfort.value}
      </span> : null
    case 'craft':
      return <Icon id="hammer" alt={translate('ui.crafting')} size={32} />
    case 'craft_ext':
      const { id } = item.extends;
      return <ItemIcon useAlt item={data[id]} size={32} />
    case 'chest':
    case 'door':
    case 'misc':
    case 'stand':
    case 'structure':
    case 'external':
      return null;
    default:
      return assertNever(item);
  }
}

function showSpecialIcon(special: ItemSpecial, translate: Translator) {
  switch (special) {
    case undefined: return null;
    case 'light': return <Icon id="flashlight" alt={translate('ui.itemSpecial.flashlight')} size={16} />;
    case 'strength': return <span><Icon id="weight" alt={translate('ui.weight')} size={16} />+150</span>;
    case 'search': return <Icon id="map_ping" alt="search" size={16} />;
    case 'demister': return <Icon id="Demister" alt="demister" size={16} />;
    case 'harpoon': return <Icon id="harpoon" alt={translate('ui.itemSpecial.harpoon')} size={16} />;
    case 'build': return null;
    case 'garden': return <Icon path="piece/replant" alt="gardening" size={32} />;
    case 'ground': return <Icon path="piece/raise" alt="terraforming" size={32} />;
    case 'fishing': return null;
    case 'butcher': return null;
    default: return assertNever(special);
  }
}

function renderItem(entry: SearchEntry, text: string, duplicateNames: Set<EntityId>, onClick: React.MouseEventHandler) {
  switch (entry.type) {
    case 'obj': return <SearchObject id={entry.id} text={text} onClick={onClick} duplicates={duplicateNames} />;
    case 'page': return renderLink('/', entry, text, onClick);
    case 'loc': return <SearchLocation entry={entry} text={text} onClick={onClick} />;
    case 'biome': return <SearchBiome id={entry.id} text={text} onClick={onClick} />;
    case 'event': return <SearchEvent id={entry.id} text={text} onClick={onClick} />;
    case 'effect': return <SearchEffect id={entry.id} text={text} onClick={onClick} />;
    case 'skill': return <SearchSkill id={entry.id} text={text} onClick={onClick} />;
    default: return assertNever(entry.type);
  }
}

function SearchLocation({ entry, text, onClick }: { entry: SearchEntry, text: string, onClick: React.MouseEventHandler }) {
  const [spoiler] = useGlobalState('spoiler');
  const { id } = entry;
  const loc = locationsTypeIdMap.get(id);
  if (!loc) return null;
  if (loc.tier > spoiler) return null;
  
  const boss = null; //loc.vegvisir?.boss;
  return <div className="SearchItem">
    <Link to={`/loc/${id}`} onClick={onClick}>{text}</Link>
    {boss ? <span>
      <ItemIcon item={data[boss]} useAlt />
    </span> : null}
  </div>;
}

function SearchBiome({ id, text, onClick }: BaseSearchItemProps) {
  const translate = useContext(TranslationContext);
  const biome = biomes.find(b => b.id === id);
  return biome 
    ? <Link to={`/biome/${id}`} onClick={onClick}>
        {text}
        <span className="entity-type"> &ndash; {translate(`ui.biome`)}</span>
      </Link>
    : null;
}

function renderLink(path: string, entry: SearchEntry, text: string, onClick: React.MouseEventHandler) {
  const { id } = entry;
  return <Link to={`${path}${id}`} onClick={onClick}>{text}</Link>
}

function ShortRecipe(props: { item: GameObject }) {
  const { item } = props;
  switch (item.type) {
    case 'creature':
    case 'fish':
    case 'object':
    case 'structure':
    case 'item':
    case 'spawner':
    case 'trophy':
      return null;
    case 'piece':
      const recipe = item.recipe;
      if (recipe == null) return null;
      return <Materials materials={recipe.materials} iconSize={16} />
    case 'ship':
    case 'cart':
    case 'shield':
    case 'tool':
    case 'armor':
    case 'arrow':
    case 'bolt':
    case 'missile':
    case 'weapon': {
      const recipe = recipes.find(r => r.item === item.id);
      if (recipe == null) return null;
      switch (recipe.type) {
        case 'craft':
          return <Materials materials={recipe.materials} iconSize={16} />
        case 'haldor':
        case 'hildir':
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

type BaseSearchItemProps = {
  id: EntityId;
  text: string;
  onClick: React.MouseEventHandler;
};

function SearchEvent({ id, text, onClick }: BaseSearchItemProps) {
  const translate = useContext(TranslationContext);
  const event = events.find(e => e.id === id);
  return event ? <div className="SearchItem">
    <ItemIcon item={data[event.icon]} size={32} />
    <Link to={`/event/${id}`} onClick={onClick}>
      {text}
      <span className="entity-type"> &ndash; {translate(`ui.event`)}</span>
    </Link>
    <span>
      {event.spawns.map(s => <ItemIcon key={s.id} item={data[s.id]} useAlt />)}
      {' '}
      <Icon id="time" alt={translate('ui.duration')} size={16} />
      {' '}
      {timeI2S(event.duration)} 
    </span>
  </div> : null;
}

function SearchEffect({ id, text, onClick }: BaseSearchItemProps) {
  const effect = effects.find(e => e.id === id);
  return effect ? <div className="SearchItem">
    <EffectIcon id={effect.id} size={32} />
    {' '}
    <Link to={`/effect/${id}`} onClick={onClick}>{text}</Link>
  </div> : null;
}

function SearchSkill({ id, text, onClick }: BaseSearchItemProps) {
  const translate = useContext(TranslationContext);
  return <div className="SearchItem">
    <SkillIcon skill={id} size={32} useAlt={false} />
    {' '}
    <Link to={`/skills/${id}`} onClick={onClick}>
      {text}
      <span className="entity-type"> &ndash; {translate(`ui.skill`)}</span>
    </Link>
  </div>;
}

function ItemExtra({ item }: { item: Resource }) {
  const translate = useContext(TranslationContext);
  const respawn = item.grow?.find(g => g.respawn)?.respawn ?? 0;
  if (item.summon) return <ItemIcon item={data[item.summon[0]]} useAlt size={32} />;
  if (item.Food != null) {
    return <span>
      <Icon id="health" alt={translate('ui.health')} size={16} />
      {item.Food.health}
      <Icon id="walknut" alt={translate('ui.stamina')} size={16} />
      {item.Food.stamina}
      {item.Food.eitr && <>
        <Icon id="eitr" alt={translate('ui.eitr')} size={16} />
        {item.Food.eitr}
      </>}
      <Icon id="time" alt={translate('ui.duration')} size={16} />
      {Math.round(item.Food.duration / 60)}
    </span>
  }
  if (respawn) return <span>{days(respawn)} <Icon id="time" alt={translate('ui.days')} size={16} /></span>;
  if (item.Potion != null) { 
    return <>
      <span>
        {item.Potion.health
          ? <React.Fragment key="health">
              <Icon id="health" alt={translate('ui.health')} size={16} />
              {item.Potion.health[0]} / {item.Potion.health[1]}s
            </React.Fragment>
          : null}
        {item.Potion.stamina
          ? <React.Fragment key="stamina">
              <Icon id="walknut" alt={translate('ui.stamina')} size={16} />
              {item.Potion.stamina[0]} / {item.Potion.stamina[1]}s
            </React.Fragment>
          : null}
        {item.Potion.staminaRegen
          ? <React.Fragment key="staminaRegen">
              <Icon id="walknut" alt={translate('ui.stamina')} size={16} />
              +{(item.Potion.staminaRegen - 1) * 100}%
            </React.Fragment>
          : null}
        {item.Potion.eitr
          ? <React.Fragment key="eitr">
              <Icon id="eitr" alt={translate('ui.eitr')} size={16} />
              {item.Potion.eitr[0]} / {item.Potion.eitr[1]}s
            </React.Fragment>
          : null}
        {item.Potion.eitrRegen
          ? <React.Fragment key="eitrRegen">
              <Icon id="eitr" alt={translate('ui.eitr')} size={16} />
              +{(item.Potion.eitrRegen - 1) * 100}%
            </React.Fragment>
          : null}
        {item.Potion.damageModifiers
          ? (Object.keys(item.Potion.damageModifiers) as DamageType[]).map(type => resistIcon(translate, type))
          : null}
      </span>
      <ShortRecipe item={item} />
    </>;
  }
  if (item.Value != null) {
    return <span>
      <Icon id="coin" alt={translate('Coins')} size={32} />
      {item.Value}
    </span>
  }
  if (item.Radiation != null) {
    return <span>☢️</span>
  }
  return null;
}

function SearchObject({ id, text, onClick, duplicates }: BaseSearchItemProps & { duplicates: Set<string> }) {
  const [spoiler] = useGlobalState('spoiler');
  const translate = useContext(TranslationContext);
  const item = data[id];
  if (!item) {
    return <span className="danger">Item "{id}" appears in search index, but missing from the main DB</span>
  }
  if (item.tier > spoiler) {
    return null;
  }
  const className = `SearchItem`;
  const linkClassName = itemClasses(item).join(' ');
  switch (item.type) {
    case 'spawner':
      return null;
    case 'creature': {
      const { hp } = item;
      const avgDmg = averageAttacksDamage(item);
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
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
    case 'fish': {
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        <span>
          <List separator="">{item.spawners
            .flatMap(s => s.biomes)
            .map(b => <span title={translate(`ui.biome.${b}`)} key={b}>{biome[b]}</span>)
          }</List>
        </span>
      </div>
    }
    case 'item':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>
          {text}
          {duplicates.has(translate(id)) && <span className="entity-type"> &ndash; {translate(`ui.itemType.${item.type}`)}</span>}
        </Link>
        <ItemExtra item={item} />
      </div>
    case 'trophy':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        <span>
        {item.summon
        ? <ItemIcon item={data[item.summon[0]]} useAlt size={32} /> : null}
          {`${findDropChanceFromCreature(item.id) * 100}% `}
          <Icon id="trophies" size={20} alt="" />
        </span>
      </div>
    case 'tool':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        {showSpecialIcon(item.special, translate)}
        <ShortRecipe item={item} />
      </div>
    case 'weapon':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        {showSpecialIcon(item.special, translate) ?? <ShortWeaponDamage damage={item.damage[0]} skill={item.skill} />}
        <ShortRecipe item={item} />
      </div>
    case 'shield':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        <span>
          <SkillIcon skill="Blocking" useAlt size={16} />
          {first(item.block)}
        </span>
        <ShortRecipe item={item} />
      </div>
    case 'armor':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        <span>{
          showSpecialIcon(item.special, translate) ??
          <>
            <Icon id="armor" alt={translate('ui.armor')} size={16} />
            {first(item.armor)}
          </>
        }</span>
        <ShortRecipe item={item} />
      </div>
    case 'arrow':
    case 'bolt':
    case 'missile':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        <span><ShortWeaponDamage damage={item.damage} skill={SkillType.Bows} /></span>
        <ShortRecipe item={item} />
      </div>
    case 'object':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>
          {text}
          {duplicates.has(translate(id)) && <span className="entity-type"> &ndash; {translate(`ui.itemSubtype.${item.subtype}`)}</span>}
        </Link>
        {
          item.Plant
            ? <span>
                {days(item.Plant.growTime[0]).toFixed(1)}
                –
                {days(item.Plant.growTime[1]).toFixed(1)}
                {' '}
                <Icon id="time" alt={translate('ui.days')} size={16} />
              </span>
            : null
        }
      </div>
    case 'piece':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        {pieceExtra(item, translate)}
        <ShortRecipe item={item} />
      </div>
    case 'structure':
      return  <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
      </div>
    case 'ship':
    case 'cart':
      return <div className={className}>
        <ItemIcon item={item} size={32} />
        <Link to={`/obj/${id}`} onClick={onClick} className={linkClassName}>{text}</Link>
        <span>
          <Icon id="weight" alt={translate('ui.weight')} size={16} />
          {item.storage[0] * item.storage[1]}
        </span>
      </div>
    default:
      return assertNever(item);
  }
}

const PER_PAGE = 30;

const searchSelector = createSelector(
  ({ searchTerm }: { searchTerm: string }) => searchTerm,
  ({ spoiler }: { spoiler: number }) => spoiler,
  ({ mods }: { mods: boolean }) => mods,
  ({ disabled }: { disabled: boolean }) => disabled,
  (term: string, spoiler: number, mods: boolean, disabled: boolean) => {
    const all = [...match(term, { mods, disabled })];
    return all.filter(entry => entry.tier <= spoiler);
  },
);

const arraySliceSelector = createSelector(
  ({ items }: { items: SearchEntry[] }) => items,
  ({ len }: { len: number }) => len,
  (items, len) => items.slice(0, len),
);

const duplicateNamesSelector = createSelector(
  ({ items }: { items: SearchEntry[] }) => items,
  ({ translate }: { translate: Translator }) => translate,
  (items, translate) => {
    const groups = groupBy(items, item => translate(item.i18nKey));
    const duplicateKeys = Object
      .entries(groups)
      .filter(([, group]) => group.length > 1)
      .map(([key]) => key)
    return new Set(duplicateKeys);
  }
)

export const Search = () => {
  const history = useHistory();
  const translate = useContext(TranslationContext);
  const [spoiler] = useGlobalState('spoiler');
  const [mods] = useGlobalState('searchInMods');
  const [disabled] = useGlobalState('searchInDisabled');

  const [len, setLen] = useState(0);
  const [index, setIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const items = searchSelector({ searchTerm, spoiler, mods, disabled });
  const itemsToDisplay = arraySliceSelector({ items, len });
  const [lastItem, setLastItem] = useState<Element | null>(null);

  const duplicateNames = duplicateNamesSelector({ items: itemsToDisplay, translate });

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

  useLayoutEffect(() => {
    document.querySelectorAll(".SearchResults li")[index]?.scrollIntoView({ block: 'nearest' });
  }, [index]);

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
      ? <ul className="SearchResults">
          {itemsToDisplay.map((entry, i) => {
            const text = translate(entry.i18nKey);
            return (
              <li key={`${entry.type}_${entry.id}`}
                className={i === index ? 'active' : ''}
                tabIndex={0}>
                {renderItem(entry, text, duplicateNames, clearSearch)}
              </li>
            );
          })}
          {len < items.length ? <li key="#last-item"><Icon id="hammer_spinner" alt="loading"/></li> : null}
        </ul>
      : null}
    </div>
  );
};
