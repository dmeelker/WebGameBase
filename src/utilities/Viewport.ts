import { Rectangle, Size, Vector } from "./Trig";
import * as Dom from "./Dom";
import { FrameTime } from "./FrameTime";
import { randomInt } from "./Random";

export class Viewport {
    private readonly _size: Size;
    private readonly _bounds: Rectangle;
    private readonly _parentElement;
    private _element: HTMLElement;
    private readonly _canvas: HTMLCanvasElement;
    private readonly _canvasContext: CanvasRenderingContext2D;
    private readonly _uiElement: HTMLElement;
    private readonly _shaker = new Shaker();

    public constructor(size: Size, element: HTMLElement) {
        this._size = size;
        this._bounds = new Rectangle(0, 0, size.width, size.height);
        this._parentElement = element;

        this._element = document.createElement("div");
        this._element.style.position = "relative";
        Dom.setSize(this._element, this._size);

        this._canvas = document.createElement("canvas");
        this._canvas.width = size.width;
        this._canvas.height = size.height;
        this._canvas.style.position = "absolute";
        this._canvas.style.inset = "0";
        this._element.appendChild(this._canvas);

        this._canvasContext = this._canvas.getContext("2d")!;

        this._uiElement = document.createElement("div");
        this._uiElement.style.position = "absolute";
        this._uiElement.style.inset = "0";
        this._element.appendChild(this._uiElement);

        this._parentElement.appendChild(this._element);
    }

    public clearCanvas(color: string = "black") {
        this._canvasContext.fillStyle = color;
        this._canvasContext.fillRect(0, 0, this.size.width, this.size.height);
    }

    public update(time: FrameTime) {
        this._shaker.update(time);
        this._element.style.transform = `translate(${this._shaker.shakeOffset.x}px, ${this._shaker.shakeOffset.y}px)`;
    }

    public shake(force: number, duration: number, time: FrameTime) { this._shaker.shake(force, duration, time); }
    public shakeLight(time: FrameTime) { this._shaker.shake(1, 200, time); }
    public shakeMedium(time: FrameTime) { this._shaker.shake(3, 200, time); }
    public shakeHeavy(time: FrameTime) { this._shaker.shake(5, 200, time); }

    public get size() { return this._size; }
    public get width() { return this._size.width; }
    public get height() { return this._size.height; }

    public get context() { return this._canvasContext; }
    public get uiElement() { return this._uiElement; }
    public get bounds() { return this._bounds; }

    public containsRectangle(rectangle: Rectangle) {
        return this._bounds.containsRect(rectangle);
    }
}

class Shaker {
    private _shaking = false;
    private _shakeStartTime = 0;
    private _shareDuration = 0;
    private _shakeForce = 1;
    private _shakeOffset = new Vector(0, 0);

    public shake(force: number, duration: number, time: FrameTime) {
        this._shaking = true;
        this._shakeForce = force;
        this._shakeStartTime = time.currentTime;
        this._shareDuration = duration;
    }

    public update(time: FrameTime) {
        if (this._shaking) {
            if (time.currentTime - this._shakeStartTime >= this._shareDuration) {
                this._shaking = false;
            } else {
                this._shakeOffset.x = randomInt(-this._shakeForce, this._shakeForce);
                this._shakeOffset.y = randomInt(-this._shakeForce, this._shakeForce);
            }
        } else {
            this._shakeOffset = Vector.zero;
        }
    }

    public get shakeOffset() { return this._shakeOffset; }
}