export type PrefixTree<T> = {
  children: Map<string, PrefixTree<T>>;
  results: T[];
};

export function addToTree<T>(node: PrefixTree<T>, letters: string, data: T) {
  for (const chr of letters) {
    let child = node.children.get(chr);
    if (child == null) {
      node.children.set(chr, child = treeNode())
    }
    node = child!;
    node.results.push(data);
  }
}

export function lookupInTree<T>(root: PrefixTree<T>, letters: string): T[] {
  let node: PrefixTree<T> | undefined = root;
  for (const chr of letters) {
    if (node == null) return [];
    node = node.children.get(chr);
  }
  return node ? node.results : [];
}

export const treeNode = <T>(): PrefixTree<T> => ({
  children: new Map(),
  results: [],
});

export type SearchEntry = {
  type: 'obj' | 'loc' | 'biome' | 'page' | 'event' | 'effect' | 'skill';
  path: string;
  id: string;
  tier: number;
  i18nKey: string;
  disabled: boolean;
  mod: string | undefined;
};
