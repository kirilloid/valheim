import { createElement } from 'react';

// Kids, don't try this at home, you can inadvertently call ZALGO

function createMatcher(regex: RegExp, matcher: (match: RegExpMatchArray) => JSX.Element) {
  return function makeMatcher(str: string): (JSX.Element | string)[] {
    const result: (JSX.Element | string)[] = [];
    let lastIndex = 0;
    
    for (let match of str.matchAll(regex)) {
      const { index = 0 } = match;
      if (index > lastIndex) result.push(str.slice(lastIndex, index));
      result.push(matcher(match));
      lastIndex = index + match[0]!.length;
    }

    const tail = str.slice(lastIndex);
    if (tail.length > 0) result.push(tail);
    return result;
  }
}

const matchers: ((str: string) => (JSX.Element | string)[])[] = [
  createMatcher(/(#{1,6}) +(.+?)\n/g, m => createElement(`h${m[1]?.length ?? 1}`, {}, m[2])),
  createMatcher(/```(\w+)\n(.+?)```/gm, m => createElement('pre', { className: `code code--${m[1]}` }, m[2])),
  createMatcher(/``(.+?)``/g, m => createElement('code', {}, m[1])),
  createMatcher(/\*(.+?)\*/g, m => createElement('b', {}, ...markdown(m[1]))),
  createMatcher(/_(.+?)_/g, m => createElement('i', {}, ...markdown(m[1]))),
  createMatcher(/`(.+?)`/g, m => createElement('code', {}, ...markdown(m[1]))),
  createMatcher(/!\[(.*?)\]\((.+?)\)/g, m => createElement('img', { src: m[2], alt: m[1] })),
  createMatcher(/\[(.+?)\]\((.+?)\)/g, m => createElement('a', { rel: 'noreferrer', href: m[2] }, ...markdown(m[1]))),
  createMatcher(/<br>/g, () => createElement('br')),
];

export function markdown(str: string | undefined) {
  if (str == null) return [];
  return matchers.reduce<(JSX.Element | string)[]>((res, fn) => res.flatMap(s => typeof s === 'string' ? fn(s) : [s]), [str]);
}
