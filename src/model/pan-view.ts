import { clamp, clamp01 } from "./utils";

type Point = { x: number; y: number };

export class PanViewModel {
  private maxZoom: number;
  // offset in original unscaled coordinates
  private position: Point = { x: 0, y: 0 };
  private dragPos: Point = { x: 0, y: 0 };
  private isDragging = false;
  private zoom: number;
  private _scale: number;

  constructor(
    private outerWidth: number,
    private outerHeight: number,
    private innerWidth: number,
    private innerHeight: number,
  ) {
    this.maxZoom = Math.log2(Math.min(
      innerWidth / outerWidth,
      innerHeight / outerHeight,
    ));
    this.zoom = 0;
    this._scale = 2 ** (this.zoom - this.maxZoom);
  }

  private update(point: Point) {
    const oldScale = this._scale;
    this._scale = 2 ** (this.zoom - this.maxZoom);
    if (oldScale === this._scale) return;
    const { x: ox, y: oy } = point;
    // ox + x = ix * scale
    // ix = (ox + x) / scale
    // x = ix * scale - ox
    const ix = (ox + this.position.x) / oldScale;
    const iy = (oy + this.position.y) / oldScale;
    this.position.x = ix * this._scale - ox;
    this.position.y = iy * this._scale - oy;
  }

  public zoomIn(point: Point, log2Scale: number = 1) {
    this.zoom = Math.min(this.zoom + log2Scale, this.maxZoom);
    this.update(point);
  }

  public zoomOut(point: Point, log2Scale: number = 1) {
    this.zoom = Math.max(this.zoom - log2Scale, 0);
    this.update(point);
  }

  public startDrag(point: Point): void {
    this.isDragging = true;
    this.dragPos.x = point.x;
    this.dragPos.y = point.y;
  }

  public onDrag(point: Point): void {
    if (!this.isDragging) return;
    const { x, y } = point;
    const dxPixels = x - this.dragPos.x;
    const dyPixels = y - this.dragPos.y;
    this.dragPos.x = x; 
    this.dragPos.y = y; 
    this.position.x -= dxPixels;
    this.position.y -= dyPixels;
  }

  private get xScroll(): number {
    return this.innerWidth * this._scale - this.outerWidth;
  }

  private get yScroll(): number {
    return this.innerHeight * this._scale - this.outerHeight;
  }

  public endDrag(): void {
    this.isDragging = false;
    // TODO: implement smooth overdrag
    this.position.x = clamp(this.position.x, 0, this.xScroll); 
    this.position.y = clamp(this.position.y, 0, this.yScroll); 
  }

  get x(): number {
    return this.position.x;
  }

  get y(): number {
    return this.position.y;
  }

  get scale(): number {
    return this._scale;
  }
}
