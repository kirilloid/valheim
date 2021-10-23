import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import '../css/Weather.css';

import type { Biome } from '../types';
import { GAME_DAY, INTRO_DURATION, WEATHER_PERIOD, WIND_PERIOD, INTRO_WEATHER } from '../model/game';
import { createRNG } from '../model/random';

import { EnvId, envSetup, envStates, WeatherBalance } from '../data/env';
import { biomes } from '../data/location';

import { TranslationContext, useDebounceEffect } from '../effects';
import { showNumber } from './helpers';
import { Icon } from './Icon';
import { assertNever, clamp01, lerp, timeI2S } from '../model/utils';
import { combineGens } from '../model/iter';

const biomeIds = biomes.map(({ id }) => id);

const rollWeather = (weathers: WeatherBalance, roll: number) => {
  const totalWeight = weathers.reduce((weight, weather) => weight + weather[1], 0);
  const randomWeight = totalWeight * roll;
  let sum = 0;
  for (const [env, weight] of weathers) {
    sum += weight;
    if (randomWeight < sum) return env;
  }
  return weathers.slice(-1)[0]![0];
};

type Wind = {
  angle: number;
  intensity: number;
};

const addOctave = (time: number, octave: number, wind: Wind): void => {
  const period = Math.floor(time / (WIND_PERIOD * 8 / octave));
  const rng = createRNG(period);
  wind.angle += rng.random() * 2 * Math.PI / octave;
  wind.intensity += (rng.random() - 0.5) / octave;
};

const getGlobalWind = (time: number): Wind => {
  const wind = {
    angle: 0,
    intensity: 0.5
  };
  addOctave(time, 1, wind);
  addOctave(time, 2, wind);
  addOctave(time, 4, wind);
  addOctave(time, 8, wind);
  wind.intensity = clamp01(wind.intensity);
  wind.angle = (wind.angle * 180 / Math.PI) % 360;
  return wind;
};

const getRng = (seed: number) => {
  const rng = createRNG(seed);
  return rng.randomRange();
};

function getWeatherAt(biome: Biome, index: number): EnvId {
  if (index < INTRO_DURATION / WEATHER_PERIOD) return INTRO_WEATHER;
  return rollWeather(envSetup[biome], getRng(index));
}

type WeatherEvent = {
  type: 'day';
  time: number;
  day: number;
} | {
  type: 'sunrise' | 'sunset';
  time: number;
} | {
  type: 'wind';
  time: number;
  angle: number;
  intensity: number;
} | {
  type: 'weather';
  time: number;
  weather: EnvId;
};

const SUNRISE = 0.15 * GAME_DAY;
const SUNSET = 0.85 * GAME_DAY;

type WeatherGen = Generator<WeatherEvent, void, void>;

function* dailyGen(): WeatherGen {
  let day = 0;
  while (true) {
    yield {
      type: 'day',
      time: day * GAME_DAY,
      day: day + 1,
    };
    yield {
      type: 'sunrise',
      time: day * GAME_DAY + SUNRISE,
    };
    yield {
      type: 'sunset',
      time: day * GAME_DAY + SUNSET,
    };
    day++;
  }
}

function* windGen(biome: Biome): WeatherGen {
  let windIndex = 0;
  while (true) {
    const time = windIndex * WIND_PERIOD;
    const { angle, intensity } = getGlobalWind(time);
    const env = getWeatherAt(biome, Math.floor(time / WEATHER_PERIOD));
    const [windMin, windMax] = envStates[env].wind;
    yield {
      type: 'wind',
      time,
      angle,
      intensity: lerp(windMin, windMax, intensity),
    };
    windIndex++;
  }
}

function* envGen(biome: Biome): WeatherGen {
  yield {
    type: 'weather',
    time: 0,
    weather: INTRO_WEATHER,
  };
  let index = Math.floor(INTRO_DURATION / WEATHER_PERIOD);
  yield {
    type: 'weather',
    time: INTRO_DURATION,
    weather: getWeatherAt(biome, index),
  };
  while (true) {
    index++;
    yield {
      type: 'weather',
      time: index * WEATHER_PERIOD,
      weather: getWeatherAt(biome, index),
    };
  }
}

function eventCompare(e1: WeatherEvent, e2: WeatherEvent) {
  return e1.time - e2.time;
}

function* fullGen(biome: Biome): WeatherGen {
  const weather = combineGens(envGen(biome), windGen(biome), eventCompare);
  yield* combineGens(dailyGen(), weather, eventCompare);
}

const formatWindDirection = (angle: number): string => {
  const index = Math.round((angle + 360) % 360 / 22.5);
  return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'][index] ?? "???";
};

const ArrowIcon = ({ angle }: { angle: number }) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"
    width={32}>
    <path stroke="#000" fill="#fff"
      d="M 16,4 L24,12 L22,14 L17.5,9.5 L17.5,25.5 L14.5,25.5 L14.5,9.5 L10,14 L8,12 L16,4 z"
      style={{
        transform: `rotate(${Math.round(angle)}deg)`,
        transformOrigin: 'center'
      }}
    />
  </svg>
);

const formatPercent = (value: number) => showNumber(100 * value) + "%";

function WindEvent({ event }: { event: WeatherEvent & { type: 'wind' } }) {
  return <span>
    <ArrowIcon angle={event.angle} />
    {' '}
    {Math.round(event.angle)}&deg;
    {' '}
    {formatWindDirection(event.angle)}
    {' '}
    <Icon id="wind" size={32} alt="" />
    {' '}
    {formatPercent(event.intensity)}
  </span>
  }

function ForecastEvent({ event }: { event: WeatherEvent }) {
  const translate = useContext(TranslationContext);
  switch (event.type) {
    case 'day':
      return <strong>Day {event.day}</strong>;
    case 'sunrise':
      return <>Sunrise</>;
    case 'sunset':
      return <>Sunset</>
    case 'weather':
      return <>{envStates[event.weather].emoji} {translate(`ui.weather.${event.weather}`)}</>;
    case 'wind':
      return <WindEvent event={event} />
    default:
      return assertNever(event);
  }
}

const ROW_HEIGHT = 32;
const VIEWPORT_ROWS = 100;
const CHUNK_SIZE = 20;

const MAX_DAY = 9999;

function parseDay(day: string = '1'): number {
  const num = Number(day) >>> 0;
  if (!isFinite(num)) return 1;
  if (num < 1) return 1;
  if (num > MAX_DAY) return MAX_DAY;
  return num;
}

function parseBiome(biome?: string): Biome {
  return biomeIds.find(id => id === biome) ?? biomeIds[0]!;
}

class BiomeGen {
  private _generator: WeatherGen;
  private _events: WeatherEvent[] = [];
  private _dayIndices: number[] = [];

  constructor(biome: Biome) {
    this._generator = fullGen(biome);
  }

  private generateItem() {
    const res = this._generator.next();
    // at least don't create infinite loop if something goes wrong
    if (res.done) throw new RangeError("Unexpected generator end");
    const { value } = res;
    const newIndex = this._events.length;
    this._events.push(value);
    if (value.type === 'day' && value.day === this._dayIndices.length + 1) {
      this._dayIndices.push(newIndex);
    }
  }

  addMore(rows: number) {
    for (let i = 0; i < rows; i++) {
      this.generateItem();
    }
  }

  getToDay(day: number): number {
    while (this._dayIndices.length < day) {
      this.generateItem();
    }
    return this._dayIndices[day - 1]!;
  }

  getClosestDay(index: number): number {
    this.ensureGenerated(index + 1);
    const result = this._dayIndices.findIndex(idx => idx > index);
    return result === -1 ? this._dayIndices.length : result;
  }

  ensureGenerated(number: number): void {
    while (this._events.length < number) {
      this.generateItem();
    }
  }

  get events(): ReadonlyArray<WeatherEvent> {
    return this._events;
  }
}

const biomeGens = new Map(
  biomeIds.map(id => [id, new BiomeGen(id)])
);

export function Weather() {
  const translate = useContext(TranslationContext);
  const params = useParams<{ day?: string; biome?: string; }>();
  const history = useHistory();
  const [biome, setBiome] = useState<Biome>(parseBiome(params.biome));
  const dayRef = useRef(1);
  const gen = biomeGens.get(biome);
  if (!gen?.events.length) {
    gen?.addMore(VIEWPORT_ROWS);
  }
  const events = gen?.events ?? [];
  const [scroll, setScroll] = useState(0);
  
  useDebounceEffect({ biome, day: dayRef.current }, (state) => {
    const path = `/weather/${state.biome}/#${state.day}`;
    if (history.location.pathname !== path) {
      history.replace(path);
    }
  }, 500);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    gen?.ensureGenerated(VIEWPORT_ROWS);
    const el = ref.current;
    if (!el || !gen) return () => {}; 
    const callback = () => {
      console.log('scroll');
      const rowIdx = Math.floor(el.scrollTop / ROW_HEIGHT);
      const day = gen.getClosestDay(rowIdx);
      dayRef.current = day;
      if (inputRef.current) {
        inputRef.current.value = String(day);
      }
      if (rowIdx + VIEWPORT_ROWS > events.length) gen?.addMore(CHUNK_SIZE);
      const newScroll = Math.floor(rowIdx / CHUNK_SIZE) * CHUNK_SIZE;
      setScroll(newScroll);
    };
    el.addEventListener('scroll', callback, { capture: false, passive: true });
    return () => {
      el.removeEventListener('scroll', callback, { capture: false });
    };
  }, [ref, gen, setScroll]);

  const startIndex = Math.max(scroll - CHUNK_SIZE, 0);
  const endIndex = Math.min(startIndex + VIEWPORT_ROWS, events.length - 1);
  console.log('render');

  function goToDay(day: number) {
    if (!gen) return;
    const rowIdx = gen.getToDay(day);
    gen.addMore(VIEWPORT_ROWS);
    if (rowIdx == null) return;
    dayRef.current = day;
    setScroll(rowIdx);
    setTimeout(() => {
      const { current } = ref;
      if (current) current.scrollTop = rowIdx * ROW_HEIGHT;
    }, 100);
  }

  function changeBiome(newBiome: Biome) {
    biomeGens.get(newBiome)?.ensureGenerated(gen?.events.length ?? 0);
    setBiome(newBiome);
  }

  return <div className="Weather">
    <h1>{translate('ui.page.weather')}</h1>
    <div className="Weather__controls">
      <div className="Weather__control">
        <label htmlFor="day">
          {translate('ui.day')}
        </label>
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="&lt;" onClick={() => goToDay(dayRef.current - 1)} />
        {' '}
        <input type="number" id="day" inputMode="numeric" pattern="[0-9]*" min="1" max={MAX_DAY}
          ref={inputRef}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              goToDay(dayRef.current);
            }
          }}
          onChange={(e) => {
            const day = Number(e.target.value);
            dayRef.current = day;
          }}
        />
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="&gt;" onClick={() => goToDay(dayRef.current + 1)} />
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="Go" onClick={() => {
          goToDay(dayRef.current);
        }} />
      </div>
      <div className="Weather__control">
        <label htmlFor="biome">{translate('ui.biome')}</label>          
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="&lt;" disabled={biomeIds[0] === biome} onClick={() => {
          const index = biomeIds.indexOf(biome);
          if (index >= 1) {
            changeBiome(biomeIds[index - 1]!);
          };
        }} />
        {' '}
        <select id="biome" value={biome} onChange={e => {
          changeBiome(e.target.value as Biome);
        }}>
          {biomeIds.map(id => <option key={id} value={id}>{translate(`ui.biome.${id}`)}</option>)}
        </select>
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="&gt;" disabled={biomeIds[biomeIds.length - 1] === biome} onClick={() => {
          const index = biomeIds.indexOf(biome);
          if (index < biomeIds.length - 1) {
            changeBiome(biomeIds[index + 1]!);
          };
        }} />
      </div>
    </div>
    <div ref={ref} className="Weather__Forecast">
      {events.slice(startIndex, endIndex).map((e, i) => {
        const index = Math.floor(e.time / WEATHER_PERIOD);
        const weatherType = getWeatherAt(biome, index);
        const dayTime = e.time % GAME_DAY;
        const isDay = dayTime >= SUNRISE && dayTime < SUNSET;
        return <div
          key={(i + startIndex) % VIEWPORT_ROWS}
          className="Weather__Event"
          style={{
            top: `${ROW_HEIGHT * (i + startIndex)}px`,
            height: `${ROW_HEIGHT}px`,
          }}>
          <span className={`Weather__time Weather__time--${isDay ? 'day' : 'night'}`}>
            {timeI2S(Math.round((e.time % GAME_DAY) / GAME_DAY * 24 * 60))}
          </span>
          <span className={`Weather__details Weather--${weatherType}`}>
            <ForecastEvent event={e} />
          </span>
        </div>
      })}
      <div style={{ position: 'absolute', top: `${events.length * ROW_HEIGHT}px`, width: '100%', height: '1px' }}> </div>
    </div>
  </div>
}
