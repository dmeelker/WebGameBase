export class GamepadPoller {
    private _previousState: Gamepad[] = [];
    private _currentState: Gamepad[] = [];

    public poll() {
        this._previousState = this._currentState;

        let state = navigator.getGamepads();

        if (state) {
            this._currentState = state as Gamepad[];

            //this.logButtonPresses();
        }
    }

    // private logButtonPresses() {
    //     for (let padIndex = 0; padIndex < this._currentState.length; padIndex++) {
    //         if (!this._currentState[padIndex]) {
    //             continue;
    //         }

    //         for (let i = 0; i < this._currentState[padIndex].buttons.length; i++) {
    //             let button = this._currentState[padIndex].buttons[i];
    //             if (button.pressed) {
    //                 console.log(`Gamepad ${padIndex} Button: ${i}`);
    //             }
    //         }
    //     }
    // }

    public isButtonDown(gamepadIndex: number, buttonIndex: number): boolean {
        return this.buttonDownInState(this._currentState, gamepadIndex, buttonIndex)
    }

    public wasButtonPressedInFrame(gamepadIndex: number, buttonIndex: number): boolean {
        return !this.buttonDownInState(this._previousState, gamepadIndex, buttonIndex) && this.isButtonDown(gamepadIndex, buttonIndex);
    }

    private buttonDownInState(state: Gamepad[], gamepadIndex: number, buttonIndex: number): boolean {
        if (state[gamepadIndex]) {
            return state[gamepadIndex].buttons[buttonIndex].pressed;
        } else {
            return false;
        }
    }

    public anyButtonPressedInFrame(gamepadIndex: number): boolean {
        const gamepad = this._currentState[gamepadIndex];
        if (!gamepad) {
            return false;
        }

        return gamepad.buttons.filter(button => button.pressed).length > 0;
    }
}