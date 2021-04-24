import data from './objects';
import { creatures } from './creatures';

type PrefixTree<T> = {
  children: Map<string, PrefixTree<T>>;
  results: T[];
};

function addToTree<T>(node: PrefixTree<T>, letters: Iterable<string>, data: T) {
  for (const chr of letters) {
    let child = node.children.get(chr);
    if (child == null) {
      node.children.set(chr, child = treeNode())
    }
    node = child!;
    node.results.push(data);
  }
}

function lookupInTree<T>(root: PrefixTree<T>, letters: Iterable<string>): T[] {
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

for (const key of Object.keys(data).concat(creatures.map(c => c.id))) {
  const letters = key.toLowerCase();
  addToTree(startTree, letters, key);
  for (let i = 1; i < letters.length - 1; i++) {
    addToTree(anyTree, letters.slice(i), key);
  }
}

export function match(query: string): string[] {
  const res1 = lookupInTree(startTree, query);
  const res2 = lookupInTree(anyTree, query);
  return res1.length >= 10
    ? res1.slice(0, 10)
    : res1.concat(res2).slice(0, 10)
}
