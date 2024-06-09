export class Keyboard {
    private readonly _keyStates = new Map<string, boolean>();
    private readonly _frameButtonPresses = new Map<string, boolean>();

    constructor() {
        this.hook();
    }

    private hook() {
        document.addEventListener('keydown', event => this.onKeyDown(event));
        document.addEventListener('keyup', event => this.onKeyUp(event));
    }

    private onKeyDown(keyEvent: KeyboardEvent) {
        if (keyEvent.repeat) {
            return this.preventBubble(keyEvent);
        }

        //console.log(keyEvent);
        this._keyStates.set(keyEvent.code, true);
        this._frameButtonPresses.set(keyEvent.code, true);
        return this.preventBubble(keyEvent);
    }

    private onKeyUp(keyEvent: KeyboardEvent) {
        this._keyStates.set(keyEvent.code, false);
        return this.preventBubble(keyEvent);
    }

    public isButtonDown(code: string): boolean {
        if (this._keyStates.has(code)) {
            return this._keyStates.get(code)!;
        }

        return false;
    }

    public wasButtonPressedInFrame(code: string): boolean {
        if (this._frameButtonPresses.has(code)) {
            return this._frameButtonPresses.get(code)!;
        }

        return false;
    }

    public anyButtonPressedInFrame(): boolean {
        return this._frameButtonPresses.size > 0;
    }

    public nextFrame() {
        this._frameButtonPresses.clear();
    }

    private preventBubble(keyEvent: KeyboardEvent): boolean {
        // Prevent bubbling for keys that might scroll the document
        if (keyEvent.code == "ArrowUp" || keyEvent.code == "ArrowDown" || keyEvent.code == "ArrowLeft" || keyEvent.code == "ArrowRight") {
            keyEvent.preventDefault();
            keyEvent.stopPropagation();
            return false;
        } else {
            return true;
        }
    }
}