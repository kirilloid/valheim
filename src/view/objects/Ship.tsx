import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';

import '../../css/Ship.css';
import { TranslationContext } from '../../effects';

import { getSailSpeed, getSailSpeeds, Sail } from '../../model/ship';
import { magnitude, timeI2S } from '../../model/utils';
import { Ship as ShipPiece } from '../../types';

import { Resistances } from '../helpers';
import { ItemHeader } from '../parts/ItemHeader';
import { Source } from '../parts/Source';

type ChartProps = {
  ship: ShipPiece;
  wind: number;
}

const styles = {
  fineMarker: '#eee',
  coarseMarker: '#ccc',
};

const WIDTH = 280;
const HEIGHT = 400;

const CX = 20;
const CY = 140;
const RADIUS = 225;
const SPEED_SIZE = 8;

const fromPolar = (r: number, p: number): [number, number] => {
  return [CX + r * Math.cos(p), CY - r * Math.sin(p)];  
};

const Meridians = React.memo(({ num, className }: { num: number, className: string }) => {
  const lines = [];
  const [x0, y0] = fromPolar(0, 0);
  for (let i = 0; i <= num; i++) {
    const angle = Math.PI * i / num - Math.PI / 2;
    const [x1, y1] = fromPolar(RADIUS, angle);
    lines.push(<line key={i} x1={x1} y1={y1} x2={x0} y2={y0} className={className} />);
  }

  return <g>{lines}</g>;
});

const Circles = React.memo(({ num, className }: { num: number, className: string }) => {
  const arcs = [];
  // ctx.beginPath();
  for (let i = 1; i <= num; i++) {
    const radius = RADIUS * i / num;
    const largeArcFlag = 1;
    var d = [
      "M", CX, CY + radius, 
      "A", radius, radius, 0, largeArcFlag, 0, CX, CY - radius,
    ].join(" ");

    arcs.push(<path key={i} d={d} className={className} fill="none" />);
  }
  return <g>{arcs}</g>
});

const Curve = React.memo(({ sailSize, sail, wind, color }: {
  sailSize: number;
  sail: ShipPiece['sail'];
  wind: number;
  color: string;
}) => {
  const rho = (angle: number) => magnitude(getSailSpeed(sail, sailSize, wind, angle));
  const phi = (angle: number) => Math.PI / 2 - angle;
  const coords = (angle: number) => {
    const r = rho(angle) / SPEED_SIZE * RADIUS;
    const p = phi(angle);
    return fromPolar(r, p);  
  }
  const step = 1;
  // ctx.beginPath();
  const points = [];
  const [x0, y0] = coords(0);
  points.push(`M${x0} ${y0}`);
  for (let i = 0; i <= 180; i += step) {
    const [x, y] = coords(Math.PI * i / 180);
    points.push(`L${x} ${y}`);
    // ctx.lineTo(...);
  }
  return <path d={points.join(',')} fill="none" stroke={color} strokeWidth={2} />
});

const Labels = React.memo(() => {
  const labels = [];
  // speed
  for (let i = 1; i <= SPEED_SIZE; i++) {
    labels.push(<text className="Windrose__label" x={CX - 12} y={CY + i * RADIUS / SPEED_SIZE + 4}>{i}</text>)
  }
  // speed text
  labels.push(<g style={{ transform: `translate(${CX}px, ${CY}px) rotate(-90deg) translate(${-CX}px, ${-CY}px)` }}>
    <text className="Windrose__label" x={CX} y={CY - 4}>speed, m/s</text>
  </g>);
  // meridians
  for (let i = 180; i >= 45; i -= 10) {
    const angle = Math.PI * (90 - i) / 180;
    labels.push(<text className="Windrose__label"
      x={CX + (RADIUS + 16) * Math.cos(angle) - 12}
      y={CY - (RADIUS + 16) * Math.sin(angle) + 6}
    >{i}°</text>)
  }
  return <g>{labels}</g>;
});

const Windrose = React.memo(({ ship, wind }: ChartProps) => {
  const rudderSpeed = magnitude(getSailSpeed(ship.sail, Sail.Slow, 0, 0)) / SPEED_SIZE;
  const RR = rudderSpeed * RADIUS;

  return (<div className="Windrose">
    <div className="Windrose__chart">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT}>
        <Meridians num={36} className="fine-marker" />
        <Circles num={SPEED_SIZE * 2} className="fine-marker" />;
        <Meridians num={18} className="coarse-marker" />
        <Circles num={SPEED_SIZE} className="coarse-marker" />;
        <path d={`M${CX} ${CY+RR}, A${RR} ${RR} 0 0 0 ${CX} ${CY-RR}`} fill="none" stroke="#cc0" strokeWidth={2} />
        <Curve sailSize={Sail.Full} sail={ship.sail} wind={wind} color="#f00" />
        <Curve sailSize={Sail.Half} sail={ship.sail} wind={wind} color="#f80" />
        <Labels />
      </svg>
    </div>
    <div className="Windrose__legend">
      <ul>
        <li><span className="Windrose__legend-item Windrose__legend-item--full-sail" /> Full sail</li>
        <li><span className="Windrose__legend-item Windrose__legend-item--half-sail" /> Half sail</li>
        <li><span className="Windrose__legend-item Windrose__legend-item--paddle" /> Paddle</li>
      </ul>
    </div>
  </div>);
});

const Acceleration = React.memo(({ ship, wind }: ChartProps) => {
  const dpi = 1;
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

export function Ship(props: { item: ShipPiece }) {
  const translate = useContext(TranslationContext);
  const { item } = props;
  const [dpi, setDpi] = useState(window.devicePixelRatio);

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

  const { sailWidth } = item;
  const { target, size } = item.piece!;
  const { hp, damageModifiers } = item.wear;
  const [ cols, rows ] = item.storage;
  const storage = cols * rows;

  return (<>
    <ItemHeader item={item} />
    <section>
      <h2>{translate(`ui.piece`)}</h2>
      <dl>
        <dt>{translate('ui.healthStructure')}</dt><dd>{hp}</dd>
        <Resistances mods={damageModifiers} />
        <dt>target</dt><dd>{translate(`ui.pieceTarget.${target}`)}</dd>
        {size ? <><dt>size</dt><dd>{size.filter(Boolean).join('×')} m</dd></> : null}
        <><dt>sail width</dt><dd>{sailWidth} m</dd></>
      </dl>
    </section>
    <section>
      <h2>{translate('ui.ship')}</h2>
      <dl>
        <dt>{translate('ui.shipMove.oar')}</dt><dd>{translate('ui.speed.ms', item.speed.rudder)}</dd>
        <dt>{translate('ui.shipMove.sail')}</dt><dd>{translate('ui.speedRange.ms', item.speed.full[0]!, item.speed.full[4]!)}</dd>
        <dt>capacity</dt><dd>{storage}</dd>
      </dl>
      <Windrose ship={item} wind={0.5} />
    </section>
    <Source id={item.id} />
  </>);
}
