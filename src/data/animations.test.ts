import { calculateOneAnimation, calculateChainAnimations } from '../model/animations';
import * as a from './animations';

describe('animations', () => {
  test('trivial', () => {
    expect(calculateOneAnimation({
      duration: 0.1999999,
      exit: 1,
      speed: 1,
      events: [],
    }).ticks).toBe(10);
  });

  test('hit', () => {
    expect(calculateOneAnimation(a.atgeir_attack[0]).ticks).toBe(42);
  });

  test('hit + speed', () => {
    expect(calculateOneAnimation(a.atgeir_attack[2]).ticks).toBe(64);
  });

  test('speed + hit', () => {
    expect(calculateOneAnimation(a.battleaxe_attack[1]).ticks).toBe(46);
  });

  test('global speed & exit', () => {
    expect(calculateOneAnimation(a.swing_pickaxe).ticks).toBe(70);
  });

  test('chain (before end)', () => {
    expect(calculateOneAnimation(a.greatsword[0]).ticks).toBe(48);
  });

  test('chain (after end) shouldn\'t trigger', () => {
    expect(calculateOneAnimation(a.unarmed_attack[0]).chain).toBe(false);
  });

  test('speed within freezeFrame span', () => {
    expect(calculateOneAnimation(a.swing_axe[2]).ticks).toBe(41);
  });

  test('hit & speed at the same tick', () => {
    expect(calculateOneAnimation(a.battleaxe_attack[2]).ticks).toBe(36);
  });

  test('knife_stab chain', () => {
    expect(calculateChainAnimations(a.knife_stab).map(r => r.ticks)).toStrictEqual([22, 29, 36]);
  });

  test('dump chain', () => {
    expect(calculateChainAnimations(a.dualaxes).map(r => r.ticks)).toStrictEqual([21, 35, 52, 73]);
  });

  test('dump single', () => {
    expect(calculateOneAnimation(a.dualaxes_secondary).hits).toStrictEqual([46]);
  });

  test('swing_axe chain', () => {
    expect(calculateChainAnimations(a.swing_axe).map(r => r.ticks)).toStrictEqual([48, 40, 41]);
  });
  test('speed @ t=0', () => {
    expect(calculateOneAnimation(a.sword_secondary).ticks).toBe(92);
  });
});
