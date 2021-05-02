import React from 'react';

import type { EntityId } from '../types';

type Props = {
  type: string;
  id: EntityId;
  size?: number;
}

export function Icon(props: Props) {
  const { type, id, size = 32 } = props;
  return <img key={id} className="icon" src={`/icons/${type}/${id}.png`} alt={id} width={size} height={size} />;
}
