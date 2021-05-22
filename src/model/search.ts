import { data } from './objects';
import { creatures } from './creatures';
import { preloadLanguage } from '../translation.effect';
import { EntityId } from '../types';
import { getCraftingStationId } from './building';

type PrefixTree<T> = {
  children: Map<string, PrefixTree<T>>;
  results: T[];
};

function addToTree<T>(node: PrefixTree<T>, letters: string, data: T) {
  for (const chr of letters) {
    let child = node.children.get(chr);
    if (child == null) {
      node.children.set(chr, child = treeNode())
    }
    node = child!;
    node.results.push(data);
  }
}

function lookupInTree<T>(root: PrefixTree<T>, letters: string): T[] {
  let node: PrefixTree<T> | undefined = root;
  for (const chr of letters) {
    if (node == null) return [];
    node = node.children.get(chr);
  }
  return node ? node.results : [];
}

const treeNode = <T>(): PrefixTree<T> => ({
  children: new Map(),
  results: [],
});

const fullMatch = new Map<string, EntityId>();
const startTree = treeNode<string>();
const anyTree = treeNode<string>();

preloadLanguage().then(dict => {
  for (const obj of Object.values(data)) {
    if (obj.disabled) continue;
    const key = obj.id;
    const entry = dict[key];
    if (entry == null) continue;
    const normalized = entry.toLowerCase();
    fullMatch.set(normalized, key);
    const words = normalized.split(' ');
    for (const word of words) {
      addToTree(startTree, word, key);
      for (let i = 1; i < word.length - 1; i++) {
        addToTree(anyTree, word.slice(i), key);
      }
    }
    const addTag = (tags: string) => {
      for (const tag of tags.split(' ')) {
        for (const t of (dict[tag] ?? '').split(' ')) {
          addToTree(startTree, t, key);
        }
      }
    }
    for (const tag of obj.tags ?? []) {
      addTag(`ui.tags.${tag}`);
    }
    const typeTags = dict[`ui.itemType.${obj.type}`];
    if (typeTags != null) {
      switch (obj.type) {
        case 'weapon':
          if (obj.slot === 'both') addTag('ui.tags.2hand');
          break;
        case 'piece':
          if (obj.subtype === 'chair') addTag('ui.tags.sit');
          switch (obj.subtype) {
            case 'chair':
            case 'bed':
            case 'table':
              addTag('ui.tags.furniture');
              break;
            case 'craft_ext':
              addTag(getCraftingStationId(obj.extends.id));
              break;
            case 'fireplace':
              addTag('ui.tags.fire');
          }
      }
      if ('summon' in obj) addTag('ui.tags.summon');
      for (const tag of typeTags.split(' ')) {
        addToTree(startTree, tag, key);
      }
    }
    const tags = dict[`${key}.tags`];
    if (tags != null) {
      for (const tag of tags.split(' ')) {
        addToTree(startTree, tag, key);
      }
    }
  }
});

const emptyResults: string[] = [];

const _cache = new Map<string, Iterable<string>>();

export function match(query: string): Iterable<EntityId> {
  query = query.toLocaleLowerCase().trim();
  const cached = _cache.get(query);
  if (cached) return cached;
  const terms = query.match(/\S+/g);
  if (!terms) return emptyResults;
  const rankedResult = new Map<EntityId, number>();
  const fm = fullMatch.get(query);
  // if (fm != null) result.set(fm, 100);
  for (const term of terms) {
    for (const item of lookupInTree(startTree, term)) {
      rankedResult.set(item, (rankedResult.get(item) ?? 0) + 10);
    }
    for (const item of lookupInTree(anyTree, term)) {
      rankedResult.set(item, (rankedResult.get(item) ?? 0) + 1);
    }
  }
  const max = Math.max(...rankedResult.values());
  const maxRank = Math.floor(max / 10) * 10;
  // console.log({ maxRank });
  
  const result = Array.from(rankedResult.entries())
    .filter(([, val]) => val >= maxRank)
    .sort(([key1, val1], [key2, val2]) => (fm === key2 ? 1 : 0) - (fm === key1 ? 1 : 0)
                                       || (val2 - val1)
                                       )
    .map(([key]) => key);
  _cache.set(query, result);
  return result;
}
