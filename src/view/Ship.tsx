import React, { useCallback, useEffect, useRef, useState } from 'react';

import '../css/Ship.css';

import { EnvId, envSetup, envStates } from '../model/env';
import { ships, getSailSpeed, getSailSpeeds, Sail } from '../model/ship';
import { magnitude, timeI2S } from '../model/utils';
import { Biome, Ship as ShipPiece } from '../types';

type ChartProps = {
  dpi: number;
  ship: ShipPiece;
  wind: number;
}

const styles = {
  fineMarker: '#eee',
  coarseMarker: '#ccc',
};

const weathers = Object.keys(envSetup[Biome.Ocean]) as EnvId[];

const winds: [EnvId, number][] = weathers.map(name => {
  const { wind } = envStates.find(e => e.id === name)!;
  return [name, (wind[0] + wind[1]) / 2];
});

const Windrose = React.memo(({ dpi, ship, wind }: ChartProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const WIDTH = 280;
  const HEIGHT = 400;
  const width = WIDTH * dpi;
  const height = HEIGHT * dpi;

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    // draw polar grid
    const cx = 20 * dpi;
    const cy = 140 * dpi;
    const radius = 225 * dpi;
    ctx.lineWidth = dpi;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, width, height);
    const SPEED_SIZE = 8;

    const fromPolar = (r: number, p: number): [number, number] => {
      return [cx + r * Math.cos(p), cy - r * Math.sin(p)];  
    };

    const meridians = (num: number, style: string) => {
      ctx.strokeStyle = style;
      ctx.beginPath();
      for (let i = 0; i <= num; i++) {
        const angle = Math.PI * i / num - Math.PI / 2;
        ctx.moveTo(...fromPolar(radius, angle));
        ctx.lineTo(...fromPolar(0, 0));
      }
      ctx.closePath();
      ctx.stroke();
    };

    const circles = (num: number, style: string) => {
      ctx.strokeStyle = style;
      ctx.beginPath();
      for (let i = 1; i <= num; i++) {
        ctx.arc(cx, cy, radius * i / num, 3 * Math.PI / 2, Math.PI / 2);
      }
      ctx.closePath();
      ctx.stroke();  
    };

    const windrose = (sailSize: number, wind: number, color: string) => {
      const rho = (angle: number) => magnitude(getSailSpeed(ship.sail, sailSize, wind, angle));
      const phi = (angle: number) => Math.PI / 2 - angle;
      const coords = (angle: number) => {
        const r = rho(angle) / SPEED_SIZE * radius;
        const p = phi(angle);
        return fromPolar(r, p);  
      }
      const step = 1;
      ctx.beginPath();
      ctx.moveTo(...coords(0));
      for (let i = 0; i <= 180; i += step) {
        ctx.lineTo(...coords(Math.PI * i / 180));
      }
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.closePath();
    };
    // grid
    meridians(36, styles.fineMarker);
    circles(SPEED_SIZE * 10, styles.fineMarker);
    meridians(18, styles.coarseMarker);
    circles(SPEED_SIZE, styles.coarseMarker);

    ctx.lineWidth = 2 * dpi;
    ctx.strokeStyle = '#cc0';
    const rudderSpeed = magnitude(getSailSpeed(ship.sail, Sail.Slow, 0, 0)) / 8;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * rudderSpeed, 3 * Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    ctx.closePath();
    windrose(Sail.Full, wind, '#f00');
    windrose(Sail.Half, wind, '#f80');

    // labels
    ctx.fillStyle = '#444';
    ctx.font = `${16 * dpi}px sans-serif`;
    for (let i = 1; i <= SPEED_SIZE; i++) {
      ctx.fillText(
        String(i),
        cx - 12 * dpi,
        cy + i * radius / SPEED_SIZE + 4 * dpi,
      );
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-cx, -cy);
    ctx.fillText('speed, m/s', cx, cy - 4 * dpi);
    ctx.restore();
    for (let i = 180; i >= 45; i -= 10) {
      const angle = Math.PI * (90 - i) / 180;
      ctx.fillText(
        `${i}°`,
        cx + (radius + 16 * dpi) * Math.cos(angle) - 12 * dpi,
        cy - (radius + 16 * dpi) * Math.sin(angle) + 6 * dpi,
      );  
    }
  }, [dpi, ship, wind, width, height]);
  return (
    <canvas ref={canvas} width={width} height={height} style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
      Your browser somehow does not support canvas
    </canvas>
  );
});

const Acceleration = React.memo(({ dpi, ship, wind }: ChartProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const WIDTH = 499;
  const HEIGHT = 399;

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, WIDTH * dpi, HEIGHT * dpi);
    const horMax = 480;
    const verMax = 400;

    const MAX_TIME = 40;
    const MAX_SPEED = 8;

    const grid = (horRes: number, verRes: number, color: string) => {
      ctx.beginPath();
      const horStep = horMax / horRes;
      for (let x = 0; x < horMax; x += horStep) {
        ctx.moveTo((0.5 + x) * dpi, (HEIGHT - 0.5) * dpi);
        ctx.lineTo((0.5 + x) * dpi, (HEIGHT - verMax - 0.5) * dpi);
      }
      const verStep = verMax / verRes;
      for (let y = 0; y < verMax; y += verStep) {
        ctx.moveTo((         0.5) * dpi, (HEIGHT - 0.5 - y) * dpi);
        ctx.lineTo((horMax + 0.5) * dpi, (HEIGHT - 0.5 - y) * dpi);
      }
      ctx.closePath();
      ctx.lineWidth = dpi;
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    const chart = (sailState: Sail, strokeStyle: string) => {
      const speeds = getSailSpeeds(ship.sail, sailState, wind, 180, MAX_TIME);
      const gx = (i: number) => (0.5 + i * horMax / MAX_TIME) * dpi;
      const gy = (i: number) => (HEIGHT - (speeds[i] ?? 0) * verMax / MAX_SPEED - 0.5) * dpi;
      
      ctx.lineWidth = 2 * dpi;
      ctx.strokeStyle = strokeStyle;
  
      ctx.beginPath();
      ctx.moveTo(gx(0), gy(0));
      for (let i = 1; i <= MAX_TIME; i++) ctx.lineTo(gx(i), gy(i));
      ctx.stroke();  
    };

    grid(MAX_TIME, MAX_SPEED * 10, styles.fineMarker);
    grid(MAX_TIME / 10, MAX_SPEED, styles.coarseMarker);
    chart(Sail.Full, '#f00');
    chart(Sail.Half, '#f80');
    chart(Sail.Slow, '#cc0');
    // labels
    ctx.fillStyle = '#444';
    ctx.font = `${16 * dpi}px sans-serif`;
    for (let t = 0; t <= MAX_TIME; t += 10) {
      ctx.fillText(timeI2S(t), verMax * dpi, horMax * dpi * t / MAX_TIME);
    }
    const text = 'time';
    const metrics = ctx.measureText(text);
    ctx.fillText(text, verMax * dpi, horMax * dpi - metrics.width);
  }, [dpi, ship, wind]);
  return (
    <canvas ref={canvas} width={WIDTH * dpi} height={HEIGHT * dpi} style={{ width: `${WIDTH}px`, height: `${HEIGHT}px` }}>
      Your browser somehow does not support canvas
    </canvas>
  );
});

const windOptions = winds.slice().sort((a, b) => a[1] - b[1]).map(w => w[0]);

export function Ship() {
  const [dpi, setDpi] = useState(window.devicePixelRatio);
  const [ship, setShip] = useState<ShipPiece>(ships[0]!);
  const [wind, setWind] = useState(winds.find(e => e[0] === 'Clear')![1]);

  const updateShip = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const newShip = ships.find(s => s.id === id);
    if (newShip != null && newShip !== ship) {
      setShip(newShip);
    }
  }, [ship, setShip]);

  const updateWind = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const newWind = winds.find(w => w[0] === id)?.[1];
    if (newWind != null && newWind !== wind) {
      setWind(newWind);
    }
  }, [wind, setWind]);
  
  const updateDpi = useCallback(() => {
    if (dpi !== window.devicePixelRatio) {
      setDpi(window.devicePixelRatio);
    }
  }, [dpi, setDpi]);

  useEffect(() => {    
    window.addEventListener('resize', updateDpi, false);
    return () => {
      window.removeEventListener('resize', updateDpi, false);
    }
  }, [dpi, updateDpi]);

  return (
    <div>
      <label htmlFor="ship">ship:</label>
      <select id="ship" onChange={updateShip} value={ship.id} autoFocus>
        {ships.map(s => <option value={s.id} key={s.id}>{s.id}</option>)}
      </select>{' | '}
      <label htmlFor="wind">weather:</label>
      <select id="wind" onChange={updateWind}>
        {windOptions.map(w => <option value={w} key={w} selected={winds.find(ww => ww[0] === w)?.[1] === wind}>{w}</option>)}
      </select><br/>
      <span className="square" style={{ backgroundColor: '#f00' }}></span> full sail
      <span className="square" style={{ backgroundColor: '#f80' }}></span> half sail
      <span className="square" style={{ backgroundColor: '#cc0' }}></span> rudder
      <Windrose dpi={dpi} ship={ship} wind={wind} />
      <Acceleration dpi={dpi} ship={ship} wind={wind} />
    </div>
  );
}
