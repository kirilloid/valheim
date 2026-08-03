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

describe('zoom', () => {
  test('center', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoom(center, 1);
    expect(model.scale).toEqual(0.5);
    expect(model.x).toEqual(50);
    expect(model.y).toEqual(50);
  });

  test('left top', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoom(leftTop, 1);
    expect(model.scale).toEqual(0.5);
    expect(model.x).toEqual(0);
    expect(model.y).toEqual(0);
  });

  test('right bottom', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoom(rightBottom, 1);
    expect(model.scale).toEqual(0.5);
    expect(model.x).toEqual(100);
    expect(model.y).toEqual(100);
  });

  test('unzoom', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoom(center, 2);
    model.zoom(leftTop, -1);
    expect(model.x).toEqual(75);
    expect(model.y).toEqual(75);
  });

});

describe('drag', () => {
  test('min zoom - no drag', () => {
    const model = new PanViewModel(100, 100, 200, 200);
    model.startDrag({ x: 10, y: 10 });
    model.onDrag({ x: 10, y: 10 });
    model.endDrag();
    expect(model.x).toEqual(0);
    expect(model.y).toEqual(0);
  });

  test('max zoom - 1:1', () => {
    const model = new PanViewModel(100, 100, 200, 200);
    model.zoom(center, 1);
    expect(model.x).toEqual(50);
    expect(model.y).toEqual(50);
    model.startDrag({ x: 50, y: 50 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(100);
    expect(model.y).toEqual(100);
  });

  test('intermediate zoom level', () => {
    const model = new PanViewModel(100, 100, 400, 400);
    model.zoom(center, 1);
    expect(model.x).toEqual(50);
    expect(model.y).toEqual(50);
    model.startDrag({ x: 50, y: 50 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(100);
    expect(model.y).toEqual(100);
  });

  test('overdrag', () => {
    const model = new PanViewModel(100, 100, 200, 200, { overdrag: true });
    model.zoom({ x: 0, y: 0 }, 1);
    model.startDrag({ x: 500, y: 500 });
    model.onDrag({ x: 0, y: 0 });
    model.endDrag();
    expect(model.x).toEqual(100);
    expect(model.y).toEqual(100);
  });
});