import React, { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import '../../css/PanView.css';

import { PanViewModel } from '../../model/pan-view';
import { nop } from '../../model/utils';
import { Pair } from '../../types';

export function PanView({ children, size, minZoom, maxZoom, onMouseMove, onZoomChange }: {
  children: ReactNode,
  size: number,
  minZoom?: number,
  maxZoom?: number,
  onMouseMove?: (pos: { x: number, y: number }) => void,
  onZoomChange?: (zoomLevel: number) => void,
}) {
  const refOuter = useRef<HTMLDivElement>(null);
  const refInner = useRef<HTMLDivElement>(null);
  const refScaledSize = useRef<number>(0);

  const [sizes, setSizes] = useState<Pair<number>>([0, 0]);
  const updateSize = useCallback(() => {
    const width = refOuter.current?.offsetWidth ?? 0;
    const height = refOuter.current?.offsetHeight ?? 0;
    if (sizes[0] !== width || sizes[1] !== height) {
      setSizes([width, height]);
    }
  }, [sizes, setSizes]);

  useEffect(updateSize, [size]);
  
  useLayoutEffect(() => {
    window.addEventListener('resize', updateSize);
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [updateSize]);

  useLayoutEffect(() => {
    const outer = refOuter.current;
    const inner = refInner.current;

    if (outer == null || inner == null) return nop;

    const model = new PanViewModel(
      outer.offsetWidth,
      outer.offsetHeight,
      inner.offsetWidth,
      inner.offsetHeight,
      { minZoom, maxZoom },
    );
    if (refScaledSize.current !== 0) {
      const value = refScaledSize.current * size;
      const zoom = Math.log2(model.scale / value);
      model.zoomIn({ x: size/2, y: size/2 }, zoom);
    }
    refScaledSize.current = model.scale / size;
    onZoomChange?.(model.scale);

    inner.style.transformOrigin = 'left top';

    function getXY(event: MouseEvent) {
      // FIXME: this works only in WebKit
      return {
        x: (event as any).layerX,
        y: (event as any).layerY,
      }
    }

    function start(event: MouseEvent) {
      model.startDrag(event);
    }

    function end() {
      model.endDrag();
      update();
    }

    function drag(event: MouseEvent) {
      model.onDrag(event);
      update();
    }

    function move(event: MouseEvent) {
      const coords = model.getCoords(getXY(event));
      onMouseMove?.(coords);
    }

    function update() {
      if (inner == null) return;
      refScaledSize.current = model.scale / size;
      inner.style.transform = `translate(${-Math.round(model.x)}px, ${-Math.round(model.y)}px) scale(${model.scale})`;
      inner.style.setProperty('--scale', String(model.scale));
    }

    function onWheel(event: WheelEvent) {
      event.stopPropagation();
      const { deltaY } = event;
      const pos = getXY(event);
      if (deltaY < 0) {
        model.zoomIn(pos, 0.125);
      } else {
        model.zoomOut(pos, 0.125);
      }
      onZoomChange?.(model.scale);
      update();
    }

    outer.addEventListener('wheel', onWheel, { passive: true });
    outer.addEventListener('mousedown', start, { passive: true });
    outer.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mousemove', drag, { passive: true });
    document.addEventListener('mouseup', end, { passive: true });
    document.addEventListener('mouseleave', end);
    update();

    return () => {
      outer.removeEventListener('wheel', onWheel);
      outer.removeEventListener('mousedown', start);
      outer.removeEventListener('mousemove', move);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('mouseleave', end);
    }
  }, [refOuter, refInner, size, minZoom, maxZoom, onMouseMove, onZoomChange, sizes]);

  return <div className="PanView__outer" ref={refOuter}>
    <div className="PanView__inner" ref={refInner}>
      {children}
    </div>
  </div>
}