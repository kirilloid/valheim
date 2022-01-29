import type { ShieldConfig } from '../../model/combat';
import type { State } from './reducer';

import { parseShield, parseState, serializeShield, serializeState } from './url';
import { shields } from './items';

const simplifyShield = ({ item: { id: item }, ...rest }: ShieldConfig) => ({ item, ...rest });

const simplifyEnemy = ({ creature: { id: creature }, ...rest }: State['enemy']) => ({ creature, ...rest });

function simplifyState({ enemy, players, shield, armor, resTypes }: State) {
  return {
    enemy: simplifyEnemy(enemy),
    players,
    shield: shield && simplifyShield(shield),
    armor,
    resTypes,
  };
}

function testShield(description: string, state: ShieldConfig) {
  test(description, () => {
    const str = serializeShield(state);
    const state2 = parseShield(str);
    if (state2 == null) return fail("Parsed as null");
    expect(simplifyShield(state)).toEqual(simplifyShield(state2));
  });
}

describe('shield', () => {
  test('parse empty', () => {
    expect(parseShield()).toBe(undefined);
    expect(parseShield('')).toBe(undefined);
  });

  const item = shields[0]!;
  testShield('basic', { item, level: 1, skill: 0 });
  testShield('level-1', { item, level: 2, skill: 0 });
  testShield('level-2', { item, level: 3, skill: 0 });
  testShield('skill', { item, level: 1, skill: 30 });
  testShield('level & skill', { item, level: 3, skill: 30 });
  testShield('another item', { item: shields[3]!, level: 1, skill: 0 });
});

describe('state', () => {
  test('parse empty', () => {
    const state = parseState('');
    expect(state.players).toEqual(1);
    expect(state.resTypes).toEqual([]);
    const state2 = parseState(serializeState(state));
    expect(simplifyState(state2)).toEqual(simplifyState(state));
  });

  test('parse Bonemass case', () => {
    const cid = 'Bonemass';
    const sid = 'ShieldBoneTower';
    const items = ['ArmorRootChest', 'HelmetRoot', 'ArmorRootLegs', 'Wet', 'MeadPoisonResist'];
    const state = parseState(`${cid}-vs-armor:46-shield:${sid}-30-players:2-items:${items.join(',')}`);
    expect(simplifyState(state)).toEqual({
      enemy: {
        creature: cid,
        biome: 'Swamp',
        variety: 0,
        stars: 0,
      },
      players: 2,
      shield: {
        item: sid,
        level: 3,
        skill: 30,
      },
      armor: 46,
      resTypes: [
        'poison:veryResistant',
        'fire:weak',
        'fire:weak-pierce:resistant',
        'fire:weak-poison:resistant',
        'fire:resistant-frost:weak-lightning:weak',
      ],
    });
  });
});
