import type { Motion, MotionEvent } from '../types';
import { FRAME } from './game';
import { assertNever } from './utils';

const FREEZE_FRAME_DURATION = 0.15; // Attack.m_freezeFrameDuration

type AnimationState = {
  speed: number;
  pauseTimer: number;
  restoreSpeed: number;
}

export type AnimationResult = {
  ticks: number;
  hits: number[];
  // really means only chaining of animations, attack chain happens disregard
  chain?: boolean;
};

/** @see CharacterAnimEvent.FreezeFrame */
function freezeFrame(state: AnimationState): void {
  state.restoreSpeed = state.speed;
  state.pauseTimer = FREEZE_FRAME_DURATION;
  state.speed = 0.0001;
}

/**
 * @see CharacterAnimEvent.UpdateFreezeFrame
 * @returns {number} new speed value
 */
function updateFreezeFrame(state: AnimationState, dt: number): void {
  if (state.pauseTimer > 0) {
    state.pauseTimer -= dt;
    if (state.pauseTimer <= 0.0) {
      state.speed = state.restoreSpeed;
    }
  }
  // seems like this branch is never executed
  if (state.speed < 0.01 && state.pauseTimer < 0.0) state.speed = 1;
}

function processEvent(state: AnimationState, event: MotionEvent, result: AnimationResult) {
  switch (event.type) {
    case 'speed':
      state.speed = event.value;
      break;
    case 'hit':
      result.hits.push(result.ticks);
      freezeFrame(state);
      break;
    case 'chain':
      result.chain = true;
      break;
    case 'trailOn':
    case 'trailOff':
      // do nothing
      break;
    default:
      return assertNever(event);
  }
}

function calculateDuration(state: AnimationState, motion: Motion, dt: number): AnimationResult {
  const result = { ticks: 0, hits: [], chain: false };
  let time = 0;
  const eventsIterator = motion.events[Symbol.iterator]();
  const duration = motion.duration * motion.exit;

  let iter = eventsIterator.next();
  while (time < duration) {
    time += state.speed * motion.speed * dt;
    result.ticks++;
    updateFreezeFrame(state, dt);
    while (!iter.done && iter.value.time <= time) {
      processEvent(state, iter.value, result);
      if (result.chain) return result;
      iter = eventsIterator.next();
    }
    // result.speeds.push(state.speed);
  }
  // chain event prevents speed from resetting
  if (!result.chain) state.speed = 1;
  return result;
}

export function calculateOneAnimation(motion: Motion, dt: number = FRAME): AnimationResult {
  const state: AnimationState = {
    speed: 1,
    pauseTimer: 0,
    restoreSpeed: 1,
  };
  return calculateDuration(state, motion, dt);
}

export function calculateChainAnimations(motions: Motion[], dt: number = FRAME): AnimationResult[] {
  const state: AnimationState = {
    speed: 1,
    pauseTimer: 0,
    restoreSpeed: 1,
  };
  return motions.map(motion => calculateDuration(state, motion, dt));
}
