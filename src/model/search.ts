import { data } from './objects';
import { creatures } from './creatures';
import { preloadLanguage } from '../translation.effect';

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

const startTree = treeNode<string>();
const anyTree = treeNode<string>();

preloadLanguage().then(dict => {
  const ids = Object.keys(data).concat(creatures.map(c => c.id));
  for (const key of ids) {
    const entry = dict[key];
    if (entry == null) continue; 
    const words = entry.toLowerCase().split(' ');
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

export function match(query: string): IterableIterator<string> {
  const res1 = lookupInTree(startTree, query);
  const res2 = lookupInTree(anyTree, query);
  const visited = new Set<string>();
  return (function*() {
    for (const item of res1) {
      if (!visited.has(item)) {
        yield item;
        visited.add(item);
      }
    }
    for (const item of res2) {
      if (!visited.has(item)) {
        yield item;
        visited.add(item);
      }
    }
  }());
}
