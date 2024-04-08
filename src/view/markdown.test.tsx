import React from 'react';

import { markdown } from './markdown';

test('markdown', () => {
  expect(markdown('foo *bar*')).toEqual(['foo ', <b>bar</b>]);
  expect(markdown('foo _baz_')).toEqual(['foo ', <i>baz</i>]);
  expect(markdown('foo *bar* _baz_')).toEqual(['foo ', <b>bar</b>, ' ', <i>baz</i>]);
  expect(markdown('[link](href)')).toEqual([<a rel="noreferrer" href="href">link</a>]);
  expect(markdown('*_nested_*')).toEqual([<b><i>nested</i></b>]);
});
