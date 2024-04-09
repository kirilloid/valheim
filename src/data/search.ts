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
import { skillTiers, SkillType } from '../model/skills';

const fullMatch = new Map<string, EntityId>();
const startTree = treeNode<SearchEntry>();
const anyTree = treeNode<SearchEntry>();

function addArray<T extends { id: string; tier?: number; tags?: string[] }>(
  data: T[],
  type: SearchEntry['type'],
  path: string,
  dict: Record<string, string>,
  dictKeyMap: (arg: string) => string,
  options: {
    tags?: string;
    id?: (arg: T) => string;
    disabled?: (arg: T) => boolean;
    mod?: (arg: T) => string | undefined;
  } = {}
) {
  const visited = new Set<string>();
  for (const obj of data) {
    if ((obj as any).disabled) continue;
    const id = options.id?.(obj) ?? obj.id;
    const { tier = 0 } = obj;
    // avoid duplicating locations via different parent biomes
    if (visited.has(id)) continue
    visited.add(id);
    const i18nKey = dictKeyMap(id);
    const entry = dict[i18nKey] ?? id;
    const normalized = entry.toLowerCase();
    fullMatch.set(normalized, id);
    const words = normalized.split(' ');
    const disabled = options.disabled?.(obj) ?? false
    const mod = options.mod?.(obj);
    const item: SearchEntry = { type, id, path, i18nKey, tier, disabled, mod };
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
    if (options.tags) {
      for (const customTag of options.tags.split(' ')) {
        addTag(dict[customTag]);
      }
    }
    if (obj.tags) {
      obj.tags.forEach(addTag);
    }
  }
}

export const pages = [
  { id: offCalc, emoji: '⚔', category: 'fight' },
  { id: defCalc, emoji: '🛡', category: 'fight' },
  { id: 'events', emoji: '📆', category: 'fight' },

  { id: foodTable, emoji: '🍗', category: 'eat' },
  { id: foodPlanner, emoji: '🍴', category: 'eat' },

  { id: comfort, emoji: '🛋️', category: 'live' },
  // { id: 'build', category: 'build' },
  
  { id: mining, emoji: '⛏', category: 'plan' },
  { id: 'weather', emoji: '🌦', category: 'plan' },
  { id: skills, emoji: '🤹‍♂️', category: 'plan' },
  { id: 'world-gen', emoji: '🌐', category: 'plan', beta: true },

  { id: 'player-edit', emoji: '🕴', category: 'edit' },
  { id: 'world-edit', emoji: '🗺', category: 'edit' },
  { id: 'world-meta', emoji: '🏷️', category: 'edit' },
  { id: 'world-meta-recovery', emoji: '♻', category: 'edit' },

  { id: 'mods', emoji: '🖇️', category: 'misc' },
  { id: 'about', emoji: '📜', category: 'misc' },
];

function addObjects(dict: Record<string, string>) {
  for (const gobj of Object.values(data)) {
    const { id: key, tier, disabled = false, mod } = gobj;
    const entry = dict[key];
    if (entry == null) continue;
    const normalized = entry.toLowerCase();
    fullMatch.set(normalized, key);
    const words = normalized.split(/[ -]/);
    const item = { type: 'obj', path: '/obj/', id: key, i18nKey: key, tier, disabled, mod };
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
    if ('PointLight' in gobj) addTag('ui.tags.light');
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
  addArray(locations, 'loc', '/loc/', dict, id => `ui.location.${id}`, { id: ({ typeId }) => typeId });
  addArray(biomes, 'biome', '/biome/', dict, id => `ui.biome.${id}`, { tags: 'ui.biome', disabled: (b) => !b.active });
  addObjects(dict);
  addArray(events, 'event', '/event/', dict, id => id, { tags: 'ui.event ui.page.events.tags' });
  addArray(effects, 'effect', '/effect/', dict, id => `ui.effect.${id}`, { tags: 'ui.effect' });
  const skills = Object.entries(skillTiers).map(([id, tier]) => ({
    id: SkillType[+id]!,
    tier,
  }));
  addArray(skills, 'skill', '/skills/', dict, id => `ui.skillType.${id}`, { tags: 'ui.skill' });
});

const emptyResults: SearchEntry[] = [];

const _cache = new Map<string, Iterable<SearchEntry>>();

export function match(query: string, options: { mods?: boolean, disabled?: boolean } = {}): Iterable<SearchEntry> {
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
  
  const result = Array.from(rankedResult.entries())
    .filter(([, val]) => val >= maxRank)
    .filter(([e]) => (!e.mod || options.mods)
                  && (!e.disabled || options.disabled))
    .sort(
      ([entry1, rank1], [entry2, rank2]) =>
        (fm === entry2.id ? 1 : 0) - (fm === entry1.id ? 1 : 0)
      ||(rank2 - rank1)
    )
    .map(([key]) => key);
  _cache.set(query, result);
  return result;
}
