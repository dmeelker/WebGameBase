import { Game } from "./game/Game";
import { FrameTime } from "./utilities/FrameTime";
import { Screen } from "./utilities/ScreenManager";

export class GameScreen extends Screen {
    private _game = new Game(this.viewport, this.resources, this.inputs);

    public update(time: FrameTime): void {
        this._game.update(time);
        this.viewport.update(time);
    }

    public render(): void {
        this._game.render();
    }
}
