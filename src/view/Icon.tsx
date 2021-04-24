import React from 'react';

type Props = {
  type: string;
  id: string;
  size?: number;
}

export function Icon(props: Props) {
  const { type, id, size = 32 } = props;
  return <img key={id} className="icon" src={`/icons/${type}/${id}.png`} alt={id} width={size} height={size} />;
}
