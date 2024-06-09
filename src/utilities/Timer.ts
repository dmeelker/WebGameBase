import { FrameTime } from "./FrameTime";

type TimerCallback = () => void;

export class Timer {
    private _interval: number;
    private _repeats: boolean;
    private _lastTriggerTime: number;
    private _triggerCount = 0;

    private constructor(interval: number, repeats: boolean, time: FrameTime) {
        this._interval = interval;
        this._repeats = repeats;
        this._lastTriggerTime = time.currentTime;
    }

    static createOneOff(milliseconds: number, time: FrameTime): Timer {
        return new Timer(milliseconds, false, time);
    }

    static createRepeating(milliseconds: number, time: FrameTime): Timer {
        return new Timer(milliseconds, true, time);
    }

    public update(time: FrameTime, callback: TimerCallback) {
        if (!this._repeats && this._triggerCount > 0) {
            return;
        }

        let iterations = Math.floor((time.currentTime - this._lastTriggerTime) / this._interval);
        if (iterations == 0) {
            return;
        }

        for (let i = 0; i < iterations; i++) {
            this._triggerCount++;
            callback();
        }

        this._lastTriggerTime = time.currentTime;
    }
}