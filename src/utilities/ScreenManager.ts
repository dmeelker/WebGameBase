import { IScreens, Inputs } from "../Main";
import { Resources } from "../Resources";
import { FrameTime } from "./FrameTime";
import { Viewport } from "./Viewport";

export abstract class Screen {
    protected readonly _viewport: Viewport;
    protected readonly _resources: Resources;
    protected readonly _inputs: Inputs;
    protected readonly _screens: IScreens;

    public constructor(viewport: Viewport, resources: Resources, inputs: Inputs, screens: IScreens) {
        this._viewport = viewport;
        this._resources = resources;
        this._inputs = inputs;
        this._screens = screens;
    }

    public activate(_time: FrameTime): void { }
    public deactivate(_time: FrameTime): void { }

    public abstract update(time: FrameTime): void;
    public abstract render(): void;

    protected get viewport(): Viewport { return this._viewport; }
    protected get inputs(): Inputs { return this._inputs; }
    protected get resources(): Resources { return this._resources; }
}

export class ScreenManager {
    private _activeScreen: Screen;

    public constructor(activeScreen: Screen, time: FrameTime) {
        this._activeScreen = activeScreen;
        this.activateScreen(activeScreen, time);
    }

    public changeScreen(newScreen: Screen, time: FrameTime) {
        this.deactivateScreen(this._activeScreen, time);
        this._activeScreen = newScreen;
        this.activateScreen(newScreen, time);
    }

    private activateScreen(screen: Screen, time: FrameTime) {
        screen.activate(time);
    }

    private deactivateScreen(screen: Screen, time: FrameTime) {
        screen.deactivate(time);
    }

    public update(time: FrameTime) {
        this._activeScreen.update(time);
    }

    public render() {
        this._activeScreen.render();
    }

    public get activeScreen(): Screen { return this._activeScreen; }
}
