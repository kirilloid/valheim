import { clamp } from "./utils";

type Point = { x: number; y: number };

export class PanViewModel {
  private minZoom!: number;
  private maxZoom!: number;
  private contentMinZoom!: number;
  private contentMaxZoom!: number;
  // offset in original unscaled coordinates
  private position: Point = { x: 0, y: 0 };
  private dragPos: Point = { x: 0, y: 0 };
  private isDragging = false;
  private zoomLevel: number = 0;
  private _scale: number = 1;

  constructor(
    private outerWidth: number,
    private outerHeight: number,
    private innerWidth: number,
    private innerHeight: number,
    private options: { maxZoom?: number, minZoom?: number, overdrag?: boolean } = {},
  ) {
    this.setOuterSize(outerWidth, outerHeight);
  }

  private update(point: Point) {
    const oldScale = this._scale;
    this._scale = 2 ** (this.zoomLevel - this.contentMaxZoom);
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

  public setOuterSize(width: number, height: number) {
    this.outerWidth = width;
    this.outerHeight = height;
    this.contentMinZoom = 0;
    this.contentMaxZoom = Math.log2(Math.max(
      this.innerWidth / this.outerWidth,
      this.innerHeight / this.outerHeight,
    ));
    this.maxZoom = (this.options.maxZoom != null ? Math.log2(this.options.maxZoom) : 0)
      + this.contentMaxZoom;
    this.minZoom = this.options.minZoom != null
      ? Math.log2(this.options.minZoom)
      : this.contentMinZoom;
    this.zoom(this.position, 0);
  }

  public zoom(point: Point, log2Scale: number) {
    this.zoomLevel = clamp(this.zoomLevel + log2Scale, this.minZoom, this.maxZoom);
    this.update(point);
  }

  public getCoords(point: Point): Point {
    const x = (point.x + this.position.x) / this._scale;
    const y = (point.y + this.position.y) / this._scale;
    return { x, y };
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
    if (!this.options.overdrag) return;
    const xScroll = this.xScroll;
    this.position.x = clamp(this.position.x, Math.min(xScroll, 0), Math.max(xScroll, 0))
    const yScroll = this.yScroll;
    this.position.y = clamp(this.position.y, Math.min(yScroll, 0), Math.max(yScroll, 0)); 
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
