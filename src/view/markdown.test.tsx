import React from 'react';
import { cleanup, render } from '@testing-library/react';

import { markdown } from './markdown';

function renderMarkdown(input: string) {
  const { container } = render(<>{markdown(input)}</>);
  return container;
}

describe('markdown', () => {
  test.each([
    ['foo *bar*', 'foo <b>bar</b>', 'basic bold'],
    ['foo _baz_', 'foo <i>baz</i>', 'basic italics'],
    ['foo *bar* _baz_', 'foo <b>bar</b> <i>baz</i>', 'both b+i'],
    ['[link](href)', '<a rel="noreferrer" href="href">link</a>', 'link'],
    ['*_nested_*', '<b><i>nested</i></b>', 'nested tags'],
  ])('%s renders to %s (%s)', (markdown, html) => {
    const content = renderMarkdown(markdown);
    expect(content.innerHTML).toBe(html);
    cleanup();
  });
});
