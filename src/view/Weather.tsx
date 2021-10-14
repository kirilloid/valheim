import React, { useContext, useState } from 'react';

import type { Biome } from '../types';
import { GAME_DAY, INTRO_DURATION, WEATHER_PERIOD, WIND_PERIOD } from '../model/game';
import { createRNG } from '../model/random';

import { envSetup, envStates, introWeather, WeatherBalance } from '../data/env';
import { biomes } from '../data/location';

import { TranslationContext } from '../effects';
import { showNumber } from './helpers';
import { Icon } from './Icon';

const getWeather = (weathers: WeatherBalance, roll: number) => {
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
  wind.intensity = Math.min(1, Math.max(0, wind.intensity));
  wind.angle = (wind.angle * 180 / Math.PI) % 360;
  // while (wind.angle > 180) wind.angle -= 360;
  return wind;
};

const secondsToTime = (secs: number): string => {
  if (secs <= INTRO_DURATION) return "Intro";
  secs = secs % GAME_DAY;
  const realSecs = secs * 24 * 3600 / GAME_DAY;
  const hours = Math.floor(realSecs / 3600);
  const minutes = Math.floor((realSecs - 3600 * hours) / 60);
  return hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
};

const getBiome = (biome: Biome, weatherPeriod: number): WeatherBalance => biome === 'Meadows' && weatherPeriod < 3 ? introWeather : envSetup[biome]; 

const getRng = (seed: number) => {
  const rng = createRNG(seed);
  return rng.randomRange();
};

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

type WindEntry = { time: string, elements: (JSX.Element | string)[] };

function ForecastWind({ biome, day }: { biome: Biome, day: number }) {
  const startTime = Math.max(INTRO_DURATION - WIND_PERIOD, day * GAME_DAY);
  const endTime = (day + 1) * GAME_DAY;
  let index = 1;
  const entries: WindEntry[] = [];

  for (let time = startTime; time < endTime; index++) {
    const dayHeaderIndex = day === 1 ? 2 : 1;
    const header = index === dayHeaderIndex
      ? "Day " + day
      : secondsToTime(time);
    const entry: WindEntry = {
      time: header,
      elements: []
    };
    const windPeriod = Math.floor(time / WIND_PERIOD);
    const wind = getGlobalWind(time);
    const weatherPeriod = Math.floor(time / WEATHER_PERIOD);
    const weatherRoll = getRng(weatherPeriod);
    entry.elements.push(<ArrowIcon angle={wind.angle} />);
    entry.elements.push(`${Math.round(wind.angle)}\u00B0`);
    entry.elements.push(formatWindDirection(wind.angle));
    // addCell("wind_degrees", wind.angle.toFixed(0) + "&deg;");
    entry.elements.push(<Icon id="wind" size={32} alt="" />);
    const weather = getWeather(getBiome(biome, weatherPeriod), weatherRoll);
    const env = envStates.find(env => env.id === weather);
    let intensity = 'n/a';
    if (env) {
      const [windMin, windMax] = env.wind;
      const biomeIntensity = windMin + (windMax - windMin) * wind.intensity;
      intensity = formatPercent(biomeIntensity);
    }
    entry.elements.push(<span>{intensity}</span>);
    if (time < INTRO_DURATION && biome === 'Meadows') {
      time = INTRO_DURATION;
    } else {
      time = Math.min((windPeriod + 1) * WIND_PERIOD, (weatherPeriod + 1) * WEATHER_PERIOD);
    }
    entries.push(entry);
  }
  return <dl>
    {entries.map(({ time, elements }, i) => <React.Fragment key={i}>
      <dt>{time}</dt>
      <dd>{elements}</dd>
    </React.Fragment>)}
  </dl>
};

function ForecastWeather({ biome, day } : { biome: Biome, day: number }) {
  const startTime = Math.max(INTRO_DURATION - WEATHER_PERIOD, day * GAME_DAY);
  const endTime = (day + 1) * GAME_DAY;
  let index = 1;
  const entries: { time: string, weather: string }[] = [];
  for (let time = startTime; time < endTime; index++) {
    const weatherPeriod = Math.floor(time / WEATHER_PERIOD);
    const roll = getRng(weatherPeriod);
    const dayHeaderIndex = day === 1 ? 2 : 1;
    const header = index === dayHeaderIndex
      ? "Day " + day
      : secondsToTime(time);
    const weather = getWeather(getBiome(biome, weatherPeriod), roll);
    const emoji = envStates.find(e => e.id === weather)?.emoji ?? '?';
    entries.push({ time: header, weather: `${emoji} ${weather}` });
    if (time < INTRO_DURATION && biome === 'Meadows') {
      time = INTRO_DURATION;
    } else {
      time = (weatherPeriod + 1) * WEATHER_PERIOD;
    }
  }
  return <dl>
    {entries.map(({ time, weather }, i) => <React.Fragment key={i}>
      <dt>{time}</dt>
      <dd>{weather}</dd>
    </React.Fragment>)}
  </dl>
};

export function Weather() {
  const translate = useContext(TranslationContext);
  const [day, setDay] = useState(1);
  const [biome, setBiome] = useState<Biome>('Meadows');
  return <>
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
    <h2>weather</h2>
    <ForecastWeather biome={biome} day={day} />
    <h2>wind</h2>
    <ForecastWind biome={biome} day={day} />
  </>
}
