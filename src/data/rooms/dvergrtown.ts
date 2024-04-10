import type { LocationItem } from '../../types';
import { DungeonRoomsConfig, Theme } from './types';

import { locItem } from '../../model/game';

const allowDoor = true;

const EGGS: LocationItem[] = [
  locItem('SeekerEgg', 1, 3),
  locItem('SeekerEgg', 0.5, 7),
  locItem('Pickable_RoyalJelly'),
];

const TICKS: LocationItem[] = [
  locItem('Spawner_Tick_stared', 1, 2),
  locItem('Spawner_Tick_stared', 0.5, 2),
];

export const dvergrTown: DungeonRoomsConfig = {
  type: 'dungeon',
  prefix: 'dvergr_',
  // minRooms: 16,
  // maxRooms: 96,
  // minRequiredRooms: 1,
  // requiredRooms: room_TREASURE, room_TREASURE2
  rooms: [
    {
      id: 'entrance01',
      theme: Theme.DvergrTown,
      type: 'start',
      size: [32, 16, 8],
      weight: 1,
      connections: [
        { pos: [-16, 2, 0], type: 'dvergr', entrance: true },
        { pos: [-4, 2, -4], type: 'dvergr', allowDoor },
        { pos: [-4, 2, 4], type: 'dvergr', allowDoor },
        { pos: [12, -6, -4], type: 'dvergr', allowDoor },
        { pos: [4, 2, -4], type: 'dvergr', allowDoor },
        { pos: [16, 2, 0], type: 'dvergr', allowDoor },
        { pos: [4, 2, 4], type: 'dvergr', allowDoor },
        { pos: [12, 2, -4], type: 'dvergr', allowDoor },
        { pos: [12, 2, 4], type: 'dvergr', allowDoor },
        { pos: [16, -6, 0], type: 'dvergr', allowDoor },
        { pos: [12, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem(EGGS, 0.45, 2),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'entrance02',
      theme: Theme.DvergrTown,
      type: 'start',
      size: [24, 16, 8],
      weight: 1,
      connections: [
        { pos: [12, 2, 0], type: 'dvergr', allowDoor, entrance: true },
        { pos: [0, -6, -4], type: 'dvergr', allowDoor },
        { pos: [0, 2, -4], type: 'dvergr', allowDoor },
        { pos: [0, 2, 4], type: 'dvergr', allowDoor },
        { pos: [0, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem(EGGS, 0.45, 2),
      ],
      dist: [0.5, 0.5],
    },
    {
      id: 'stair01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 16, 8],
      weight: 1,
      connections: [
        { pos: [4, -6, -4], type: 'dvergr', allowDoor },
        { pos: [8, 2, 0], type: 'dvergr', allowDoor },
        { pos: [4, 2, -4], type: 'dvergr', allowDoor },
        { pos: [4, 2, 4], type: 'dvergr', allowDoor },
        { pos: [8, -6, 0], type: 'dvergr', allowDoor },
        { pos: [4, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stair02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [24, 16, 8],
      weight: 1,
      connections: [
        { pos: [-12, 2, 0], type: 'dvergr', allowDoor },
        { pos: [-8, 2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, 2, 4], type: 'dvergr', allowDoor },
        { pos: [8, -6, -4], type: 'dvergr', allowDoor },
        { pos: [0, 2, -4], type: 'dvergr', allowDoor },
        { pos: [12, 2, 0], type: 'dvergr', allowDoor },
        { pos: [0, 2, 4], type: 'dvergr', allowDoor },
        { pos: [8, 2, -4], type: 'dvergr', allowDoor },
        { pos: [8, 2, 4], type: 'dvergr', allowDoor },
        { pos: [12, -6, 0], type: 'dvergr', allowDoor },
        { pos: [8, -6, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // room (3)/eggs
        locItem(EGGS, 0.45),
        // enemies
        locItem('Spawner_Seeker', 1, 2),
      ],
      dist: [1],
    },
    {
      id: 'stair03',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 16, 8],
      weight: 1,
      connections: [
        { pos: [-8, 2, 0], type: 'dvergr', allowDoor },
        { pos: [8, -6, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // room (3)/dvergrtown_gate_stair/
        locItem('dvergrprops_lantern', 0.25),
      ],
      dist: [1],
    },
    {
      id: 'room01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // room/dvergrtown_gate_stair x2
        locItem('dvergrprops_lantern', 0.25, 2),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'room02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // room/dvergrtown_gate_stair x3
        locItem('dvergrprops_lantern', 0.25, 3),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'room03',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 8, 8],
      weight: 1,
      connections: [
        { pos: [4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // {room,room (1)}/dvergrtown_gate_stair x3
        locItem('dvergrprops_lantern', 0.25, 3),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'room04',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 8, 8],
      weight: 1,
      connections: [
        { pos: [4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 2),
        // room/eggs
        locItem(EGGS, 0.45),
        // enemies
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'corridor01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 2),
        // room/eggs
        locItem([
          locItem('SeekerEgg', 0.5, 9),
          locItem('SeekerEgg', 1, 4),
          locItem('Pickable_RoyalJelly'),
        ], 0.45),
      ],
      dist: [1],
    },
    {
      id: 'corridor02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      weight: 1,
      connections: [
        { pos: [-4, -2, 0], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 2),
      ],
      dist: [1],
    },
    {
      id: 'stone_corridor01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_corridor02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'stone', allowDoor },
        { pos: [0, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_corridor03',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'stone', allowDoor },
        { pos: [4, -2, 0.25], type: 'stone', allowDoor },
      ],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_room01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [0, -2, -4], type: 'stone', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
        { pos: [-4, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, 0], type: 'stone', allowDoor },
      ],
      items: [
        locItem('dvergrtown_wood_support', 0.5, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.5),
      ],
      dist: [1],
    },
    {
      id: 'stone_room02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 3,
      weight: 5,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
        { pos: [-4, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, 0], type: 'stone', allowDoor },
      ],
      items: [
        // GameObject/wood
        locItem('dvergrtown_wood_support', 0.5, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.25),
      ],
      dist: [1],
    },
    {
      id: 'stone_room03',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [0, -2, -4], type: 'dvergr', allowDoor },
        { pos: [0, -2, 4], type: 'stone', allowDoor },
        { pos: [-4, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // GameObject/wood
        locItem('dvergrtown_wood_support', 0.5, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.25),
      ],
      dist: [1],
    },
    {
      id: 'stone_room04',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 8, 8],
      minPlaceOrder: 2,
      weight: 10,
      connections: [
        { pos: [-4, -2, -4], type: 'stone', allowDoor },
        { pos: [4, -2, 4], type: 'stone', allowDoor },
        { pos: [-8, -2, 0], type: 'stone', allowDoor },
        { pos: [8, -2, 0], type: 'stone', allowDoor },
        { pos: [4, -2, -4], type: 'stone', allowDoor },
      ],
      items: [
        locItem('dvergrtown_wood_support', 0.5, 3),
        locItem(EGGS, 0.45),
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'stone_turn01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 16],
      weight: 1,
      connections: [
        { pos: [-4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 4], type: 'dvergr', allowDoor },
        { pos: [4, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrtown_wood_support', 0.5, 5),
        locItem('dvergrtown_wood_beam', 0.5, 3),
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66),
      ],
      dist: [1],
    },
    {
      id: 'stone_stair01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [24, 16, 8],
      weight: 1,
      connections: [
        { pos: [-12, 2, 0], type: 'dvergr', allowDoor },
        { pos: [12, -6, 0], type: 'stone', allowDoor },
        { pos: [8, -6, -4], type: 'stone', allowDoor },
        { pos: [8, -6, 4], type: 'stone', allowDoor },
      ],
      items: [
        // wood
        locItem([
          locItem('dvergrtown_wood_support', 1, 2),
          locItem('dvergrtown_wood_pole', 1),
        ], 0.5),
        locItem('dvergrtown_wood_support', 0.5, 4),
        locItem(EGGS, 0.45),
      ],
      dist: [1],
    },
    {
      id: 'stone_open01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [24, 16, 16],
      weight: 5,
      connections: [
        { pos: [0, 2, 8], type: 'stone', allowDoor },
        { pos: [0, 2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        // room
        locItem('dvergrprops_lantern', 0.25),
        locItem('dvergrtown_wood_support'),
        locItem('dvergrtown_wood_beam', 1, 10),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        // ..
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'stone_fence01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 8, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 8], type: 'dvergr', allowDoor },
        { pos: [-4, -2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66),
      ],
      dist: [1],
    },
    {
      id: 'room_open01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [24, 16, 16],
      weight: 5,
      connections: [
        { pos: [0, 2, 8], type: 'dvergr', allowDoor },
        { pos: [0, 2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_open02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 16, 16],
      weight: 2,
      connections: [
        { pos: [-8, 2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, 2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, 2, 8], type: 'dvergr', allowDoor },
        { pos: [-4, 2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_open03',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [24, 16, 16],
      weight: 5,
      connections: [
        { pos: [0, 2, 8], type: 'dvergr', allowDoor },
        { pos: [0, 2, -8], type: 'dvergr', allowDoor },
        { pos: [-12, 2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 3),
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_open04',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 8, 16],
      weight: 5,
      connections: [
        { pos: [-4, -2, -8], type: 'dvergr', allowDoor },
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [-4, -2, 8], type: 'dvergr', allowDoor },
        { pos: [4, -2, 8], type: 'dvergr', allowDoor },
        { pos: [8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 8),
        // eggs_hanging
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute', 0.75),
      ],
      dist: [1],
    },
    {
      id: 'roombig_corner01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-4, -2, -8], type: 'dvergr', allowDoor },
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [4, -2, -8], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
      ],
      items: [
        locItem('dvergrprops_lantern', 0.25, 4),
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute', 0.25),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 9),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_side01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x2
        locItem('dvergrprops_lantern', 0.25, 2),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_side02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x2
        locItem('dvergrprops_lantern', 0.25, 2),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_open01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 5,
      connections: [
        { pos: [8, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
        { pos: [-8, 0, 0], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_open02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 20, 16],
      weight: 3,
      connections: [
        { pos: [8, -4, 0], type: 'dvergropen', allowDoor },
        { pos: [0, -4, 8], type: 'dvergropen', allowDoor },
        { pos: [0, -4, -8], type: 'dvergropen', allowDoor },
        { pos: [-8, -4, 0], type: 'dvergropen', allowDoor },
        { pos: [-4, 4, -8], type: 'dvergr', allowDoor },
        { pos: [-8, 4, -4], type: 'dvergr', allowDoor },
        { pos: [-8, 4, 4], type: 'dvergr', allowDoor },
        { pos: [-4, 4, 8], type: 'dvergr', allowDoor },
        { pos: [4, 4, 8], type: 'dvergr', allowDoor },
        { pos: [8, 4, 4], type: 'dvergr', allowDoor },
        { pos: [8, 4, -4], type: 'dvergr', allowDoor },
        { pos: [4, 4, -8], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker', 1, 2),
        locItem('Spawner_Seeker', 0.5, 3),
        locItem('Spawner_SeekerBrute', 0.75),
        locItem('Spawner_SeekerBrute', 0.25),
        // room x4/dvergrtown_gate_corner (1)
        locItem('dvergrprops_lantern', 0.25, 8),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_corridor01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
        { pos: [8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [8, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x4
        locItem('dvergrprops_lantern', 0.25, 4),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_corridor02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [-8, -2, 4], type: 'dvergr', allowDoor },
        { pos: [0, 0, 8], type: 'dvergropen', allowDoor },
        { pos: [0, 0, -8], type: 'dvergropen', allowDoor },
        { pos: [8, -2, -4], type: 'dvergr', allowDoor },
        { pos: [8, -2, 4], type: 'dvergr', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_Seeker'),
        locItem('Spawner_Seeker', 0.66, 2),
        locItem('Spawner_SeekerBrute'),
        // dvergrtown_gate_stair x4
        locItem('dvergrprops_lantern', 0.25, 4),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 12),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_windows01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [16, 12, 16],
      weight: 1,
      connections: [
        { pos: [-8, 0, 0], type: 'dvergropen', allowDoor },
      ],
      items: [
        // enemies
        locItem('Spawner_SeekerBrute'),
        // random
        locItem([
          locItem('blackmarble_altar_crystal'),
          locItem('Pickable_BlackCoreStand', 0.66, 4),
          locItem('Spawner_SeekerBrute'),
          // enemies
          ...TICKS,
        ], 0.5),
        // hangingeggs
        locItem('CreepProp_egg_hanging01', 0.66, 6),
        locItem('Pickable_RoyalJelly'),
      ],
      dist: [1],
    },
    {
      id: 'roombig_toStone01',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 12, 16],
      weight: 3,
      connections: [
        { pos: [-4, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [4, -4, 4], type: 'stone', allowDoor },
        { pos: [4, -4, -4], type: 'stone', allowDoor },
      ],
      items: [
        // GameObject (1)/GameObject
        locItem('Vegvisir_SeekerQueen', 0.5 * 0.2),
        // wood
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
          locItem('dvergrtown_wood_support'),
          // wood
          locItem([
            locItem('dvergrtown_wood_pole', 1, 2),
            locItem('dvergrtown_wood_support'),
          ], 0.66),
        ], 0.66),
        // wood (1)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
        ], 0.66),
        // wood (2)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
          locItem('dvergrtown_wood_support'),
        ], 0.66),
        // wood (3)
        locItem([
          locItem('dvergrtown_wood_support'),
        ], 0.66),
      ],
      dist: [1],
    },
    {
      id: 'roombig_toStone02',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 12, 16],
      weight: 3,
      connections: [
        { pos: [-4, 0, 0], type: 'dvergropen', allowDoor },
        { pos: [4, -4, 4], type: 'stone', allowDoor },
        { pos: [4, -4, -4], type: 'stone', allowDoor },
      ],
      items: [
        // GameObject (1)/GameObject
        locItem('Vegvisir_SeekerQueen', 0.5 * 0.2),
        // wood (1)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
        ], 0.66),
        // wood (2)
        locItem([
          locItem('dvergrtown_wood_pole', 1, 2),
          locItem('dvergrtown_wood_support'),
        ], 0.66),
        // wood (3)
        locItem([
          locItem('dvergrtown_wood_support'),
        ], 0.66),
      ],
      dist: [1],
    },
    // roombig_endcap02: disabled
    {
      id: 'roombig_endcap02',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [16, 12, 0],
      weight: 1,
      connections: [{ pos: [0, 0, 0], type: 'dvergropen', allowDoor }],
      items: [
        // random (1)
        locItem([
          locItem('blackmarble_altar_crystal'),
          locItem('Pickable_BlackCoreStand', 0.66, 2),
          // enemies
          ...TICKS,
        ], 0.3),
      ],
      dist: [1],
    },
    {
      id: 'room_TREASURE',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      weight: 4,
      minPlaceOrder: 2,
      connections: [
        { pos: [4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        locItem('TreasureChest_dvergrtown', 0.5),
        locItem('TreasureChest_dvergrtown'),
        locItem('Pickable_DvergrMineTreasure', 0.5, 2),
        locItem('Pickable_DvergrMineTreasure', 0.33),
        locItem('Vegvisir_SeekerQueen', 0.2),
        locItem('Pickable_BlackCoreStand', 0.75, 4),
      ],
      dist: [1],
    },
    {
      id: 'room_TREASURE2',
      theme: Theme.DvergrTown,
      type: 'middle',
      size: [8, 8, 8],
      weight: 6,
      minPlaceOrder: 3,
      connections: [
        { pos: [4, -2, 0], type: 'dvergr', allowDoor },
      ],
      items: [
        // treasure
        locItem('TreasureChest_dvergrtown', 1, 2),
        locItem('Pickable_BlackCoreStand', 1, 2),
      ],
      dist: [1],
    },
    {
      id: 'room_endcap01',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [8, 8, 0],
      endCapPriority: 5,
      weight: 5,
      connections: [{ pos: [0, -2, 0], type: 'dvergr', allowDoor }],
      items: [
        locItem('blackmarble_altar_crystal', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_endcap02',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [8, 8, 0],
      endCapPriority: 5,
      weight: 5,
      connections: [{ pos: [0, -2, 0], type: 'dvergr', allowDoor }],
      items: [
        locItem('Pickable_BlackCoreStand', 0.2),
      ],
      dist: [1],
    },
    {
      id: 'room_endcap03',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [8, 8, 8],
      endCapPriority: 5,
      weight: 5,
      minPlaceOrder: 3,
      connections: [{ pos: [0, -2, -4], type: 'dvergr', allowDoor }],
      items: [
        locItem('dvergrprops_pickaxe', 0.5, 4),
        // GameObject/enemies
        locItem('Spawner_Tick_stared', 1, 2),
        locItem('Spawner_Tick_stared', 0.33, 2),
        // GameObject/wood
        locItem('dvergrtown_wood_support', 0.5),
        // eggs
        locItem(EGGS, 0.55),
      ],
      dist: [1],
    },
    {
      id: 'stone_endcap01',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [8, 8, 0],
      endCapPriority: 5,
      weight: 5,
      connections: [{ pos: [0, -2, 0], type: 'stone', allowDoor }],
      items: [],
      dist: [1],
    },
    {
      id: 'stone_endcap02',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [8, 8, 8],
      weight: 5,
      minPlaceOrder: 3,
      connections: [{ pos: [0, -2, -4], type: 'stone', allowDoor }],
      items: [
        ...TICKS,
      ],
      dist: [1],
    },
    {
      id: 'stone_endcap03',
      theme: Theme.DvergrTown,
      type: 'end',
      size: [8, 8, 8],
      weight: 5,
      minPlaceOrder: 3,
      connections: [{ pos: [0, -2, -4], type: 'stone', allowDoor }],
      items: [
        locItem('Spawner_Tick_stared', 1, 2),
        locItem('Spawner_Tick_stared', 0.33, 2),
        locItem('Vegvisir_SeekerQueen', 0.2),
      ],
      dist: [1],
    },
  ],
};
