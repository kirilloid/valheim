import React, { ReactNode, useLayoutEffect, useRef } from 'react';

import '../../css/PanView.css';

import { PanViewModel } from '../../model/pan-view';

export function PanView({ children }: { children: ReactNode }) {
  const refOuter = useRef<HTMLDivElement>(null);
  const refInner = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const outer = refOuter.current;
    const inner = refInner.current;

    if (outer == null || inner == null) return () => {};

    const model = new PanViewModel(
      outer.offsetWidth,
      outer.offsetHeight,
      inner.offsetWidth,
      inner.offsetHeight,
    );

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

    function update() {
      if (inner == null) return;
      inner.style.transform = `translate(${-Math.round(model.x)}px, ${-Math.round(model.y)}px) scale(${model.scale})`;
    }

    function onWheel(event: WheelEvent) {
      event.stopPropagation();
      const { deltaY } = event;
      const pos = getXY(event);
      if (deltaY < 0) {
        model.zoomIn(pos, 0.25);
      } else {
        model.zoomOut(pos, 0.25);
      }
      update();
    }

    outer.addEventListener('wheel', onWheel, { passive: true });
    outer.addEventListener('mousedown', start, { passive: true });
    document.addEventListener('mousemove', drag, { passive: true });
    document.addEventListener('mouseup', end, { passive: true });
    document.addEventListener('mouseleave', end);
    update();

    return () => {
      outer.removeEventListener('wheel', onWheel);
      outer.removeEventListener('mousedown', start);
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', end);
      document.removeEventListener('mouseleave', end);
    }
  }, [refOuter, refInner]);

  return <div className="PanView__outer" ref={refOuter}>
    <div className="PanView__inner" ref={refInner}>
      {children}
    </div>
  </div>
}