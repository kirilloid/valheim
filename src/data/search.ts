import type { EntityId } from '../types';
import { addToTree, lookupInTree, SearchEntry, treeNode } from '../model/search';
import { data } from '../data/itemDB';
import { locations, biomes } from '../data/location';
import { events } from '../data/events';

import { preloadLanguage } from '../effects';
import { read } from '../effects/globalState.effect';
import { getDefaultUserLanguage } from '../effects/translation.effect';
import { effects } from '../data/effects';
import { comfort, defCalc, foodPlanner, foodTable, mining, offCalc, skills } from '../state';

const fullMatch = new Map<string, EntityId>();
const startTree = treeNode<SearchEntry>();
const anyTree = treeNode<SearchEntry>();

function addArray<T extends { id: string; tier?: number; tags?: string[] }>(
  data: T[],
  type: SearchEntry['type'],
  path: string,
  dict: Record<string, string>,
  dictKeyMap: (arg: string) => string,
  customTags?: string,
  idReader?: (arg: T) => string,
) {
  const visited = new Set<string>();
  for (const obj of data) {
    const id = idReader ? idReader(obj) : obj.id;
    const { tier = 0 } = obj;
    // avoid duplicating locations via different parent biomes
    if (visited.has(id)) continue
    visited.add(id);
    const i18nKey = dictKeyMap(id);
    const entry = dict[i18nKey] ?? id;
    const normalized = entry.toLowerCase();
    fullMatch.set(normalized, id);
    const words = normalized.split(' ');
    const item: SearchEntry = { type, id, path, i18nKey, tier };
    for (const word of words) {
      addToTree(startTree, word, item);
      for (let i = 1; i < word.length - 1; i++) {
        addToTree(anyTree, word.slice(i), item);
      }
    }
    const addTag = (tags: string | undefined) => {
      if (!tags) return;
      for (const tag of tags.split(' ')) {
        addToTree(startTree, tag.toLowerCase(), item);
      }
    }
    addTag(dict[`${i18nKey}.tags`]);
    if (customTags) {
      for (const customTag of customTags.split(' ')) {
        addTag(dict[customTag]);
      }
    }
    if (obj.tags) {
      obj.tags.forEach(addTag);
    }
  }
}

export const pages = [
  { id: offCalc, category: 'fight' },
  { id: defCalc, category: 'fight' },
  { id: 'events', category: 'fight' },

  { id: foodTable, category: 'eat' },
  { id: foodPlanner, category: 'eat' },

  { id: comfort, category: 'live' },
  // { id: 'build', category: 'build' },
  { id: mining, category: 'gather' },

  { id: 'weather', category: 'plan' },
  { id: skills, category: 'plan' },
  { id: 'world-gen', category: 'plan', beta: true },

  { id: 'player-edit', category: 'edit' },
  { id: 'world-edit', category: 'edit', beta: true },
  // { id: 'world-meta', category: 'edit' },
];

function addObjects(dict: Record<string, string>) {
  for (const gobj of Object.values(data)) {
    if (gobj.disabled) continue;
    const key = gobj.id;
    const tier = gobj.tier;
    const entry = dict[key];
    if (entry == null) continue;
    const normalized = entry.toLowerCase();
    fullMatch.set(normalized, key);
    const words = normalized.split(' ');
    const item = { type: 'obj', path: '/obj/', id: key, i18nKey: key, tier };
    for (const word of words) {
      addToTree(startTree, word, item);
      for (let i = 1; i < word.length - 1; i++) {
        addToTree(anyTree, word.slice(i), item);
      }
    }
    const addTag = (tags: string) => {
      for (const tag of tags.split(' ')) {
        for (const t of (dict[tag] ?? '').split(' ')) {
          addToTree(startTree, t.toLowerCase(), item);
        }
      }
    }
    for (const tag of gobj.tags ?? []) {
      addTag(`ui.tags.${tag}`);
    }
    addTag(`ui.itemType.${gobj.type}`);
    switch (gobj.type) {
      case 'weapon':
        if (gobj.slot === 'both') addTag('ui.tags.2hand');
        break;
      case 'ship':
        addTag('ui.tags.sail');
        addTag('ui.tags.transport');
        break;
      case 'cart':
        addTag('ui.tags.transport');
        break;
      case 'piece':
        addTag(`ui.pieceType.${gobj.subtype}`);
        if (gobj.subtype === 'chair') addTag('ui.tags.sit');
        switch (gobj.subtype) {
          case 'chair':
          case 'bed':
          case 'table':
            addTag('ui.tags.furniture');
            break;
          case 'craft_ext':
            addTag(gobj.extends.id);
            break;
          case 'fireplace':
            addTag('ui.tags.fire');
            addTag('ui.tags.light');
            break;
        }
        break;
      case 'item':
        if ('Food' in gobj) addTag('ui.itemType.food');
        break;
      case 'creature':
        if ('tame' in gobj) addTag('ui.tameable');
        if ('pregnancy' in gobj) addTag('ui.tamed.breeds');
        if (gobj.faction === 'Undead') addTag('ui.faction.Undead');
        break;
      case 'object':
        switch (gobj.subtype) {
          case 'tree': addTag('ui.tags.tree'); break;
          case 'plant': addTag('ui.tags.plant'); break;
        }
        break;
    }
    if ('summon' in gobj) addTag('ui.tags.summon');
    const typeTags = dict[`ui.itemType.${gobj.type}`];
    if (typeTags != null) {  
      for (const tag of typeTags.split(' ')) {
        addToTree(startTree, tag, item);
      }
    }
    const tags = dict[`${key}.tags`];
    if (tags != null) {
      for (const tag of tags.split(' ')) {
        addToTree(startTree, tag, item);
      }
    }
  }
}

const lang = read('language', getDefaultUserLanguage());

preloadLanguage(lang).then(dict => {
  addArray(pages, 'page', '/', dict, id => `ui.page.${id}`);
  addArray(locations, 'loc', '/loc/', dict, id => `ui.location.${id}`, '', ({ typeId }) => typeId);
  addArray(biomes, 'biome', '/biome/', dict, id => `ui.biome.${id}`, 'ui.biome');
  addObjects(dict);
  addArray(events, 'event', '/event/', dict, id => id, 'ui.event ui.page.events.tags');
  addArray(effects, 'effect', '/effect/', dict, id => `ui.effect.${id}`, 'ui.effect');
});

const emptyResults: SearchEntry[] = [];

const _cache = new Map<string, Iterable<SearchEntry>>();

export function match(query: string): Iterable<SearchEntry> {
  query = query.toLocaleLowerCase().trim();
  const cached = _cache.get(query);
  if (cached) return cached;
  const terms = query.match(/\S+/g);
  if (!terms) return emptyResults;
  const rankedResult = new Map<SearchEntry, number>();
  const fm = fullMatch.get(query);
  for (const term of terms) {
    const termRankedResult = new Map<SearchEntry, number>();
    for (const item of lookupInTree(anyTree, term)) termRankedResult.set(item, 1);
    for (const item of lookupInTree(startTree, term)) termRankedResult.set(item, 10);
    for (const [key, value] of termRankedResult.entries()) {
      const current = rankedResult.get(key);
      rankedResult.set(key, current == null ? value : current + value);
    }
  }
  const max = Math.max(...rankedResult.values());
  const maxRank = Math.floor(max / 10) * 10;
  // console.log({ maxRank });
  
  const result = Array.from(rankedResult.entries())
    .filter(([, val]) => val >= maxRank)
    .sort(([key1, val1], [key2, val2]) => (fm === key2.id ? 1 : 0) - (fm === key1.id ? 1 : 0)
                                       || (val2 - val1)
                                       )
    .map(([key]) => key);
  _cache.set(query, result);
  return result;
}
