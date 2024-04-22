import { PanViewModel } from './pan-view';

describe('initial', () => {
  test('uniform scale', () => {
    const model = new PanViewModel(100, 100, 200, 200);
    expect(model.scale).toEqual(0.5);
  });

/*  test('uneven scale', () => {
    const model = new PanViewModel(100, 100, 400, 200);
    expect(model.scale).toEqual(0.25);
  });*/
});

const leftTop = { x: 0, y: 0 };
const center = { x: 50, y: 50 };
const rightBottom = { x: 100, y: 100 };

xdescribe('zoom', () => {
  test('center', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoomIn(center);
    expect(model.scale).toEqual(0.5);
    expect(model.x).toEqual(50);
    expect(model.y).toEqual(50);
  });

  test('left top', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoomIn(leftTop);
    expect(model.scale).toEqual(0.5);
    expect(model.x).toEqual(0);
    expect(model.y).toEqual(0);
  });

  test('right bottom', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoomIn(rightBottom);
    expect(model.scale).toEqual(0.5);
    expect(model.x).toEqual(100);
    expect(model.y).toEqual(100);
  });

  test('unzoom', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoomIn(center, 2);
    model.zoomOut(leftTop);
    expect(model.x).toEqual(25);
    expect(model.y).toEqual(25);
  });

});

xdescribe('drag', () => {
  test('min zoom - no drag', () => {
    const model = new PanViewModel(100, 100, 200, 200);
    model.startDrag({ x: 10, y: 10 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(0);
    expect(model.y).toEqual(0);
  });

  test('max zoom - 1:1', () => {
    const model = new PanViewModel(100, 100, 200, 200);
    model.zoomIn(center);
    model.startDrag({ x: 50, y: 50 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(50);
    expect(model.y).toEqual(50);
  });

  test('intermediate zoom level', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoomIn(center);
    model.startDrag({ x: 50, y: 50 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(50);
    expect(model.y).toEqual(50);
  });

  test('overdrag', () => {
    const model = new PanViewModel(100, 100, 200, 200);
    model.zoomIn({ x: 0, y: 0 });
    model.startDrag({ x: 500, y: 500 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(100);
    expect(model.y).toEqual(100);
  });
});