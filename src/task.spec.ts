import test from 'ava';

import { CORRECT } from './correctResult';
import { getCategories } from './mockedApi';
import { buildCategoryTree } from './task';

test('buildCategoryTree', async (t) => {
  const tree = await buildCategoryTree(getCategories);
  t.deepEqual(tree, CORRECT, 'structures are not matching');
});
