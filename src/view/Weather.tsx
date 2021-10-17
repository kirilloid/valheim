import React, { useContext, useState } from 'react';

import type { Biome } from '../types';
import { GAME_DAY, INTRO_DURATION, WEATHER_PERIOD, WIND_PERIOD, INTRO_WEATHER } from '../model/game';
import { createRNG } from '../model/random';

import { EnvId, envSetup, envStates, WeatherBalance } from '../data/env';
import { biomes } from '../data/location';

import { TranslationContext } from '../effects';
import { showNumber } from './helpers';
import { Icon } from './Icon';
import { assertNever, clamp01, lerp, timeI2S } from '../model/utils';
import { take } from '../model/iter';

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

function* dailyGen(): Generator<WeatherEvent> {
  let day = 0;
  while (true) {
    yield {
      type: 'day',
      time: day * GAME_DAY,
      day: day + 1,
    };
    yield {
      type: 'sunrise',
      time: (day + 0.15) * GAME_DAY,
    };
    yield {
      type: 'sunset',
      time: (day + 0.85) * GAME_DAY,
    };
    day++;
  }
}

function* windGen(biome: Biome): Generator<WeatherEvent> {
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

function* envGen(biome: Biome): Generator<WeatherEvent> {
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

function *combineGens(g1: Generator<WeatherEvent>, g2: Generator<WeatherEvent>): Generator<WeatherEvent> {
  let v1 = g1.next();
  let v2 = g2.next();
  while (!v1.done && !v2.done) {
    if (v1.done) yield v2.value;
    if (v2.done) yield v1.value;
    if (v1.value.time <= v2.value.time) {
      yield v1.value;
      v1 = g1.next();
    } else {
      yield v2.value;
      v2 = g2.next();
    }
  }
}

function* fullGen(biome: Biome): Generator<WeatherEvent> {
  const weather = combineGens(envGen(biome), windGen(biome));
  return combineGens(dailyGen(), weather);
}

const formatWindDirection = (angle: number): string => {
  const index = Math.round((angle + 360) % 360 / 22.5);
  return ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][index] ?? "???";
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
  switch (event.type) {
    case 'day':
      return <span>Day {event.day}</span>;
    case 'sunrise':
      return <span>Sunrise</span>
    case 'sunset':
      return <span>Sunset</span>
    case 'weather':
      return <span>{event.weather}</span>
    case 'wind':
      return <WindEvent event={event} />
    default:
      return assertNever(event);
  }
}

const ROW_HEIGHT = 24;

function Forecast({ events }: { events: WeatherEvent[] }) {
  return <div style={{ position: 'relative', overflowY: 'auto', flexGrow: 1 }}>
    {events.map((e, i) => {
      <div key={i} style={{ position: 'absolute', top: `${ROW_HEIGHT * i}px`, height: `${ROW_HEIGHT}px`, display: 'flex' }}>
        <span style={{ width: `100px` }}>{timeI2S((e.time % GAME_DAY) / GAME_DAY * 24 * 60)}</span>
        <ForecastEvent event={e} />
      </div>
    })}
  </div>
};

export function Weather() {
  const translate = useContext(TranslationContext);
  const [day, setDay] = useState(1);
  const [biome, setBiome] = useState<Biome>('Meadows');
  const gen = fullGen(biome);
  const events = [...take(30, gen)];
  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    <h1>{translate('ui.page.weather')}</h1>
    <section>
      <label>
        {translate('ui.day')}
        {' '}
        <input type="number" inputMode="numeric" pattern="[0-9]*"
          min="1" max="9999" value={day} onChange={e => setDay(Number(e.target.value))} />
      </label>
      <br/>
      <label>
        {translate('ui.biome')}
        {' '}
        <select value={biome} onChange={e => setBiome(e.target.value as Biome)}>
          {biomes.map(({ id }) => <option key={id} value={id}>{translate(`ui.biome.${id}`)}</option>)}
        </select>
      </label>
    </section>
    <Forecast events={events} />
  </div>
}
