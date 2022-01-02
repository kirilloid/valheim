import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';

import '../../css/Weather.css';

import { GAME_DAY, INTRO_DURATION, WEATHER_PERIOD, WIND_PERIOD, INTRO_WEATHER } from '../../model/game';
import { Random } from '../../model/random';
import { assertNever, clamp01, lerp, nop, timeI2S } from '../../model/utils';
import { combineGens, dropWhile } from '../../model/iter';

import { EnvId, envSetup, envStates, WeatherBalance } from '../../data/env';
import { biomes } from '../../data/location';
import { biome } from '../../data/emoji';

import { TranslationContext, useDebounceEffect } from '../../effects';
import { Icon } from '../parts/Icon';

const biomeIds = biomes
  .sort((a, b) => a.tier - b.tier)
  .filter(b => b.active)
  .map(({ id }) => id);

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

const random = new Random(0);

const addOctave = (time: number, octave: number, wind: Wind): void => {
  const period = Math.floor(time / (WIND_PERIOD * 8 / octave));
  random.init(period);
  wind.angle += random.random() * 2 * Math.PI / octave;
  wind.intensity += (random.random() - 0.5) / octave;
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

function getWeathersAt(index: number): EnvId[] {
  if (index < INTRO_DURATION / WEATHER_PERIOD) return biomeIds.map(() => INTRO_WEATHER);
  random.init(index);
  const rng = random.rangeFloat(0, 1);
  return biomeIds.map(biome => rollWeather(envSetup[biome], rng));
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
  absolute: number;
  intensity: number[];
  weathers: EnvId[];
} | {
  type: 'weather';
  time: number;
  weathers: EnvId[];
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
      day: day,
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

function* windGen(): WeatherGen {
  let windIndex = 0;
  while (true) {
    const time = windIndex * WIND_PERIOD;
    const { angle, intensity } = getGlobalWind(time);
    const weathers = getWeathersAt(time / WEATHER_PERIOD);
    yield {
      type: 'wind',
      time,
      angle,
      absolute: intensity,
      intensity: weathers.map(env => {
        const [windMin, windMax] = envStates[env].wind;
        return lerp(windMin, windMax, intensity);
      }),
      weathers, 
    };
    windIndex++;
  }
}

function* envGen(): WeatherGen {
  let introPeriods = Math.floor(INTRO_DURATION / WEATHER_PERIOD);
  let index = introPeriods;
  yield {
    type: 'weather',
    time: GAME_DAY,
    weathers: biomeIds.map(() => INTRO_WEATHER),
  };  
  yield {
    type: 'weather',
    time: INTRO_DURATION,
    weathers: getWeathersAt(INTRO_DURATION / WEATHER_PERIOD),
  };
  while (true) {
    index++;
    yield {
      type: 'weather',
      time: index * WEATHER_PERIOD,
      weathers: getWeathersAt(index),
    };
  }
}

function eventCompare(e1: WeatherEvent, e2: WeatherEvent) {
  return e1.time - e2.time;
}

function* fullGen(): WeatherGen {
  const weather = combineGens(envGen(), windGen(), eventCompare);
  yield* combineGens(dailyGen(), weather, eventCompare);
}

const formatWindDirection = (angle: number): string => {
  const index = Math.round((angle + 540) % 360 / 22.5);
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

const isDay = (time: number) => {
  const dayTime = time % GAME_DAY;
  return dayTime >= SUNRISE && dayTime < SUNSET;
};

const showClearMoon = (str: string, time: number) => {
  if (isDay(time)) return str;
  if (str !== '☀️') return str;
  return '🌕'; 
};

const formatPercent = (value: number) => Math.round(100 * value) + "%";

function WindEvent({ event }: { event: WeatherEvent & { type: 'wind' } }) {
  return <>
    <span>
      <ArrowIcon angle={event.angle} />
      <span className="Weather__description">
        {' '}
        {Math.round(event.angle)}&deg;
      </span>
      <span className="Weather__full-description">
        {' '}
        {formatWindDirection(event.angle)}
      </span>
    </span>
    {biomeIds.map((_, i) => <span key={i} className={classNames('Weather__type', `Weather__type--${event.weathers[i]}`)}>
      <span className="Weather__description">
        <Icon id="wind" size={32} alt="" />
        {' '}
      </span>
      {formatPercent(event.intensity[i]!)}
    </span>)}
  </>;
}

function ForecastEvent({ event }: { event: WeatherEvent }) {
  const translate = useContext(TranslationContext);
  switch (event.type) {
    case 'day':
      return <strong>Day {event.day}</strong>;
    case 'sunrise':
      return <span>Sunrise</span>;
    case 'sunset':
      return <span>Sunset</span>
    case 'weather':
      return <>
        <span>
          <span className="Weather__description">weather</span>
        </span>
      {
        event.weathers.map((weather, i) => <span key={i} className={classNames('Weather__type', `Weather__type--${weather}`)}>
          <span className="Weather__emoji">{showClearMoon(envStates[weather].emoji, event.time)}</span>
          <span className="Weather__description">{' '}{translate(`ui.weather.${weather}`)}</span>
        </span>)
      }</>;
    case 'wind':
      return <WindEvent event={event} />
    default:
      return assertNever(event);
  }
}

const HEADER_HEIGHT = 80;
const EVENTS_OFFSET_HEIGHT = HEADER_HEIGHT 
  + 40 // controls
  + 32 // table header
const ROW_HEIGHT = 32;
const VIEWPORT_ROWS = 60;
const CHUNK_SIZE = 10;

const MAX_DAY = 9999;

function parseDay(day: string = '1'): number {
  const num = Number(day) >>> 0;
  if (!isFinite(num)) return 1;
  if (num < 1) return 1;
  if (num > MAX_DAY) return MAX_DAY;
  return num;
}

class BiomeGen {
  private _generator: Iterator<WeatherEvent>;
  private _events: WeatherEvent[] = [];
  private _dayIndices: number[] = [];

  constructor() {
    this._generator = dropWhile(e => e.time < GAME_DAY, fullGen())[Symbol.iterator]();
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

const gen = new BiomeGen();

export function Weather() {
  const translate = useContext(TranslationContext);
  const history = useHistory();  
  const dayRef = useRef(parseDay(history.location.hash.replace(/^#/, '')));
  if (!gen.events.length) {
    gen.addMore(VIEWPORT_ROWS);
  }
  const events = gen?.events ?? [];
  const [scroll, setScroll] = useState(0);
  
  useDebounceEffect(dayRef.current, (day) => {
    if (history.location.hash !== `#${day}`) {
      history.replace(`/weather#${day}`);
    }
  }, 500);

  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const length = events.length;

  useLayoutEffect(() => {
    gen?.ensureGenerated(VIEWPORT_ROWS);
    const el = ref.current;
    if (inputRef.current) {
      inputRef.current.value = String(dayRef.current);
    }
    if (!el || !gen) return nop; 
    const scroll = () => {
      console.log('scroll');
      const rowIdx = Math.floor(el.scrollTop / ROW_HEIGHT);
      const day = gen.getClosestDay(rowIdx);
      dayRef.current = day;
      if (inputRef.current) {
        inputRef.current.value = String(day);
      }
      if (rowIdx + VIEWPORT_ROWS > length) gen?.addMore(VIEWPORT_ROWS);
      const newScroll = Math.floor(rowIdx / CHUNK_SIZE) * CHUNK_SIZE;
      setScroll(newScroll);
    };
    el.addEventListener('scroll', scroll, { capture: false, passive: true });
    return () => {
      el.removeEventListener('scroll', scroll, { capture: false });
    };
  }, [ref, setScroll, length]);

  const startIndex = Math.max(scroll - CHUNK_SIZE, 0);
  const endIndex = Math.min(startIndex + VIEWPORT_ROWS, length - 1);
  console.log('render');

  function goToDay(day: number) {
    if (!gen) return;
    if (day > MAX_DAY) {
      dayRef.current = day = MAX_DAY;
    };
    const rowIdx = gen.getToDay(day);
    gen.ensureGenerated(rowIdx + VIEWPORT_ROWS);
    if (rowIdx == null) return;
    dayRef.current = day;
    setScroll(rowIdx);
    setTimeout(() => {
      const { current } = ref;
      if (current) current.scrollTop = rowIdx * ROW_HEIGHT + HEADER_HEIGHT;
    }, 10);
  }

  return <div ref={ref} className="Weather">
    <h1>{translate('ui.page.weather')}</h1>
    <div className="Weather__controls">
      <div className="Weather__control">
        <label htmlFor="day">
          {translate('ui.day')}
        </label>
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="&lt;" onClick={() => goToDay(dayRef.current - 1)} />
        {' '}
        <input id="day"
          type="number" inputMode="numeric" pattern="[0-9]*"
          min="1" max={MAX_DAY}
          style={{ width: '4em' }}
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
        <input type="button" className="btn btn--sm btn--primary" value="Go" onClick={() => {
          goToDay(dayRef.current);
        }} />
        {' '}
        <input type="button" className="btn btn--sm btn--primary" value="&gt;" onClick={() => goToDay(dayRef.current + 1)} />
      </div>
    </div>
    <div className="Weather__header">
      <div className="Weather__time">{translate('ui.time')}</div>
      <div className="Weather__biome"></div>
      {biomeIds.map(id => <div key={id} className="Weather__biome">
        {biome[id]}
        {translate(`ui.biome.${id}`)}
      </div>)}
    </div>
    {events.slice(startIndex, endIndex).map((e, i) => {
      return <div
        key={(i + startIndex) % VIEWPORT_ROWS}
        className="Weather__Event"
        style={{
          top: `${ROW_HEIGHT * (i + startIndex) + EVENTS_OFFSET_HEIGHT}px`,
          height: `${ROW_HEIGHT}px`,
        }}>
        <span className={classNames(
          'Weather__time',
          `Weather__time--${isDay(e.time) ? 'day' : 'night'}`,
        )}>
          {timeI2S(Math.round((e.time % GAME_DAY) / GAME_DAY * 24 * 60))}
        </span>
        <span className="Weather__details">
          <ForecastEvent event={e} />
        </span>
      </div>
    })}
    <div className="Weather__tombstone"
      style={{ top: `${events.length * ROW_HEIGHT + EVENTS_OFFSET_HEIGHT}px` }}> </div>
  </div>
}
