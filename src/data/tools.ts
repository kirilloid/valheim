import type { Tool } from '../types';
import { pieces } from './building';
import { objects } from './objects';

const plants = objects.filter(o => o.subtype === 'plant' || o.subtype === 'tree');

export const tools: Tool[] = [
  {
    id: 'Hammer',
    type: 'tool',
    special: 'build',
    tier: 0,
    weight: 2,
    maxLvl: 3,
    durability: [100, 100],
    produces: pieces.filter(p => p.subtype !== 'external').map(p => p.id),
  },
  {
    id: 'Hoe',
    type: 'tool',
    special: 'ground',
    tier: 1,
    weight: 2,
    maxLvl: 3,
    durability: [200, 200],
    produces: [],
  },
  { 
    id: 'KnifeButcher',
    type: 'tool',
    special: 'butcher',
    emoji: '🔪',
    tier: 2,
    weight: 0.3,
    maxLvl: 1,
    durability: [200, 50],
    produces: [],
  },
  {
    id: 'Cultivator',
    type: 'tool',
    special: 'garden',
    tier: 2,
    weight: 2,
    maxLvl: 3,
    durability: [200, 200],
    produces: plants.map(p => p.id),
  },
  {
    id: 'FishingRod',
    type: 'tool',
    special: 'fishing',
    tier: 2,
    weight: 1.5,
    floating: true,
    maxLvl: 1,
    durability: [Infinity, 0],
    produces: ['Fish'],
  },
  {
    id: 'Chisel',
    disabled: true,
    type: 'tool',
    special: 'build',
    tier: 3,
    weight: 1.5,
    floating: true,
    maxLvl: 1,
    durability: [Infinity, 0],
    produces: pieces.map(p => p.id),
  },
];

for (const tool of tools) {
  tool.components = ['ItemDrop'];
}
