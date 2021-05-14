import { data } from './objects';
import { creatures } from './creatures';
import { preloadLanguage } from '../translation.effect';
import { EntityId } from '../types';

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
  const ids = creatures.map(c => c.id).concat(Object.keys(data));
  for (const key of ids) {
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
    const tags = dict[`${key}.tags`];
    if (tags != null) {
      const words = tags.split(' ');
      for (const word of words) {
        addToTree(startTree, word, key);
      }
    }
  }
});

function* emptyGenerator() {}

export function match(query: string): IterableIterator<EntityId> {
  query = query.toLocaleLowerCase().trim();
  const terms = query.match(/\S+/g);
  if (!terms) return emptyGenerator();
  const result = new Map<EntityId, number>();
/*  const fm = fullMatch.get(query);
  if (fm != null) result.set(fm, 100);*/
  for (const term of terms) {
    for (const item of lookupInTree(startTree, term)) {
      result.set(item, (result.get(item) ?? 0) + 10);
    }
    for (const item of lookupInTree(anyTree, term)) {
      result.set(item, (result.get(item) ?? 0) + 1);
    }
  }
  const max = Math.max(...result.values());
  const maxRank = Math.floor(max / 10) * 10;
  console.log({ maxRank });
  
  return (function*() {
    yield* Array.from(result.entries())
      .filter(([, val]) => val >= maxRank)
      .sort(([, val1], [, val2]) => val2 - val1 || val2 - val1)
      .map(([key]) => key);
  }());
}
