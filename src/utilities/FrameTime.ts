import { Vector } from "./Trig";

export class FrameTime {
    public readonly currentTime: number;
    public readonly timeSinceLastFrame: number;

    constructor(currentTime: number, timeSinceLastFrame: number) {
        this.currentTime = currentTime;
        this.timeSinceLastFrame = timeSinceLastFrame;
    }

    public calculateMovement(pixelsPerSecond: number): number {
        return (pixelsPerSecond / 1000) * this.timeSinceLastFrame;
    }

    public scaleVector(v: Vector): Vector {
        return new Vector(this.calculateMovement(v.x), this.calculateMovement(v.y));
    }
}
