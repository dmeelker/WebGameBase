import { Inputs } from "../Main";
import { Resources } from "../Resources";
import { Keys } from "../input/InputProvider";
import { AnimationInstance } from "../utilities/Animation";
import { FrameTime } from "../utilities/FrameTime";
import { Point } from "../utilities/Trig";
import { Viewport } from "../utilities/Viewport";

export interface IGameContext {
    get debugMode(): boolean;
    get time(): FrameTime;
    get runTime(): number;
    get resources(): Resources;
    get viewport(): Viewport;
}

export class Game implements IGameContext {
    private readonly _viewport: Viewport;
    private readonly _resources: Resources;
    private readonly _inputs: Inputs;
    private _startTime: number = 0;
    private _time: FrameTime = null!;
    private _catAnimation: AnimationInstance = null!;
    private _catLocation = new Point(310, 350);

    public constructor(viewport: Viewport, resources: Resources, inputs: Inputs) {
        this._viewport = viewport;
        this._resources = resources;
        this._inputs = inputs;

        this._catAnimation = this.resources.animations.cat.newInstance();
    }

    public update(time: FrameTime) {
        this._time = time;
        this._resources.audio.music.play();

        if (this._inputs.player1.isButtonDown(Keys.MoveLeft)) {
            this._catLocation.x -= time.calculateMovement(100);
            this._resources.audio.step.play();
        } else if (this._inputs.player1.isButtonDown(Keys.MoveRight)) {
            this._catLocation.x += time.calculateMovement(100);
            this._resources.audio.step.play();
        }
    }

    public render() {
        this.viewport.context.drawImage(this.resources.images.background, 0, 0);
        this._catAnimation.render(this.viewport.context, this._catLocation);

        this._resources.fonts.default.renderCenteredOnPoint(this.viewport, "HELLO  WORLD!", new Point(320, 120));
    }

    public get time() { return this._time; }
    public get resources() { return this._resources; }
    public get viewport() { return this._viewport; }
    public get runTime() { return this._time.currentTime - this._startTime; }
    public get debugMode() { return false; }
}