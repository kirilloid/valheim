import React from 'react';

import type { TreasureChest } from '../types';

import { ItemHeader } from './ItemHeader';
import { DropTable } from './DropTable';

export function Treasure({ item }: { item: TreasureChest }) {
  return (
    <>
      <ItemHeader item={item} />
      <section>
        <DropTable drops={[item.drop]} />
      </section>
    </>
  );
}