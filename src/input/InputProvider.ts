import { GamepadPoller } from "./GamepadPoller";
import { Keyboard } from "./Keyboard";

export enum Keys {
    MoveLeft,
    MoveRight,
    MoveUp,
    MoveDown,
    A,
    B,
    Menu,
    Select,
}

export class InputProvider {
    private readonly _keyboard: Keyboard;
    private readonly _gamepadPoller: GamepadPoller;
    private readonly _gamepadIndex: number;
    private _keyboardBindings = new Map<Keys, string>();
    private _gamepadBindings = new Map<Keys, number>();

    public constructor(keyboard: Keyboard, gamepadPoller: GamepadPoller, gamepadIndex: number) {
        this._keyboard = keyboard;
        this._gamepadPoller = gamepadPoller;
        this._gamepadIndex = gamepadIndex;
    }

    public addKeyboardBinding(key: Keys, keyCode: string) {
        this._keyboardBindings.set(key, keyCode);
    }

    public clearGamepadBindings() {
        this._gamepadBindings.clear();
    }

    public addGamepadBinding(key: Keys, buttonIndex: number) {
        this._gamepadBindings.set(key, buttonIndex);
    }

    public isButtonDown(key: Keys): boolean {
        if (this._keyboardBindings.has(key)) {
            const keyCode = this._keyboardBindings.get(key)!;

            if (this._keyboard.isButtonDown(keyCode)) {
                return true;
            }
        }

        if (this._gamepadBindings.has(key)) {
            const button = this._gamepadBindings.get(key)!;

            if (this._gamepadPoller.isButtonDown(this._gamepadIndex, button)) {
                return true;
            }
        }

        return false;
    }

    public wasButtonPressedInFrame(key: Keys): boolean {
        if (this._keyboardBindings.has(key)) {
            const keyCode = this._keyboardBindings.get(key)!;

            if (this._keyboard.wasButtonPressedInFrame(keyCode)) {
                return true;
            }
        }

        if (this._gamepadBindings.has(key)) {
            const button = this._gamepadBindings.get(key)!;

            if (this._gamepadPoller.wasButtonPressedInFrame(this._gamepadIndex, button)) {
                return true;
            }
        }

        return false;
    }

    public anyButtonPressedInFrame(): boolean {
        return this._keyboard.anyButtonPressedInFrame() || this._gamepadPoller.anyButtonPressedInFrame(this._gamepadIndex);
    }
}