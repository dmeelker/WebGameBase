import { GamepadPoller } from "./GamepadPoller";
import { InputProvider, Keys } from "./InputProvider";
import { Keyboard } from "./Keyboard";

export function createPlayer1SoloInputProvider(keyboard: Keyboard, gamepadPoller: GamepadPoller): InputProvider {
    let input = new InputProvider(keyboard, gamepadPoller, 0);
    input.addKeyboardBinding(Keys.MoveLeft, "ArrowLeft");
    input.addKeyboardBinding(Keys.MoveRight, "ArrowRight");
    input.addKeyboardBinding(Keys.MoveUp, "ArrowUp");
    input.addKeyboardBinding(Keys.MoveDown, "ArrowDown");
    input.addKeyboardBinding(Keys.A, "KeyZ");
    input.addKeyboardBinding(Keys.B, "KeyX");
    input.addKeyboardBinding(Keys.Menu, "Escape");
    input.addKeyboardBinding(Keys.Select, "Enter");

    input.addGamepadBinding(Keys.MoveLeft, 14);
    input.addGamepadBinding(Keys.MoveRight, 15);
    input.addGamepadBinding(Keys.MoveUp, 12);
    input.addGamepadBinding(Keys.MoveDown, 13);
    input.addGamepadBinding(Keys.A, 1);
    input.addGamepadBinding(Keys.B, 0);

    return input;
}

export function createPlayer1InputProvider(keyboard: Keyboard, gamepadPoller: GamepadPoller): InputProvider {
    let input = new InputProvider(keyboard, gamepadPoller, 0);
    input.addKeyboardBinding(Keys.MoveLeft, "ArrowLeft");
    input.addKeyboardBinding(Keys.MoveRight, "ArrowRight");
    input.addKeyboardBinding(Keys.MoveUp, "ArrowUp");
    input.addKeyboardBinding(Keys.MoveDown, "ArrowDown");
    input.addKeyboardBinding(Keys.A, "Comma");
    input.addKeyboardBinding(Keys.B, "Period");
    input.addKeyboardBinding(Keys.Menu, "Escape");
    input.addKeyboardBinding(Keys.Select, "Enter");

    input.addGamepadBinding(Keys.MoveLeft, 14);
    input.addGamepadBinding(Keys.MoveRight, 15);
    input.addGamepadBinding(Keys.MoveUp, 12);
    input.addGamepadBinding(Keys.MoveDown, 13);
    input.addGamepadBinding(Keys.A, 1);
    input.addGamepadBinding(Keys.B, 0);

    return input;
}

export function createPlayer2InputProvider(keyboard: Keyboard, gamepadPoller: GamepadPoller): InputProvider {
    let input = new InputProvider(keyboard, gamepadPoller, 1);
    input.addKeyboardBinding(Keys.MoveLeft, "KeyA");
    input.addKeyboardBinding(Keys.MoveRight, "KeyD");
    input.addKeyboardBinding(Keys.MoveUp, "KeyW");
    input.addKeyboardBinding(Keys.MoveDown, "KeyS");
    input.addKeyboardBinding(Keys.A, "KeyF");
    input.addKeyboardBinding(Keys.B, "KeyG");

    input.addGamepadBinding(Keys.MoveLeft, 14);
    input.addGamepadBinding(Keys.MoveRight, 15);
    input.addGamepadBinding(Keys.MoveUp, 12);
    input.addGamepadBinding(Keys.MoveDown, 13);
    input.addGamepadBinding(Keys.A, 1);
    input.addGamepadBinding(Keys.B, 0);

    return input;
}