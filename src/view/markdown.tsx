import { createElement } from 'react';

// Kids, don't try this at home, you can inadvertently call ZALGO

function createMatcher(regex: RegExp, matcher: (match: RegExpMatchArray, key: string) => JSX.Element) {
  return function makeMatcher(str: string, key: string): (JSX.Element | string)[] {
    const result: (JSX.Element | string)[] = [];
    let lastIndex = 0;
    let matchIndex = 0;
    
    for (const match of str.matchAll(regex)) {
      const { index = 0 } = match;
      if (index > lastIndex) result.push(str.slice(lastIndex, index));
      result.push(matcher(match, `${key}_${matchIndex}`));
      lastIndex = index + match[0]!.length;
      matchIndex++;
    }

    const tail = str.slice(lastIndex);
    if (tail.length > 0) result.push(tail);
    return result;
  }
}

const matchers: ((str: string, key: string) => (JSX.Element | string)[])[] = [
  createMatcher(/(#{1,6}) +(.+?)\n/g, (m, key) => createElement(`h${m[1]?.length ?? 1}`, { key }, m[2])),
  createMatcher(/```(\w+)\n(.+?)```/gm, (m, key) => createElement('pre', { key, className: `code code--${m[1]}` }, m[2])),
  createMatcher(/``(.+?)``/g, (m, key) => createElement('code', { key }, m[1])),
  createMatcher(/\*(.+?)\*/g, (m, key) => createElement('b', { key }, ...markdown(m[1]))),
  createMatcher(/_(.+?)_/g, (m, key) => createElement('i', { key }, ...markdown(m[1]))),
  createMatcher(/`(.+?)`/g, (m, key) => createElement('code', { key }, ...markdown(m[1]))),
  createMatcher(/!\[(.*?)\]\((.+?)\)/g, (m, key) => createElement('img', { key, src: m[2], alt: m[1] })),
  createMatcher(/\[(.+?)\]\((.+?)\)/g, (m, key) => createElement('a', { key, rel: 'noreferrer', href: m[2] }, ...markdown(m[1]))),
  createMatcher(/<br>/g, (_, key) => createElement('br', { key })),
];

export function markdown(str: string | undefined) {
  if (str == null) return [];
  return matchers.reduce<(JSX.Element | string)[]>(
    (res, fn, mi) => res.flatMap((s, ei) => {
      if (typeof s !== 'string') return [s];
      return fn(s, `${mi}_${ei}`);
    }), [str]);
}
