import { ILocation } from "./Trig";

export class AnimationDefinition {
    public readonly frames: Array<ImageBitmap>;
    public readonly speed: number;
    public readonly duration: number;

    public constructor(frames: Array<ImageBitmap>, speed: number) {
        this.frames = frames;
        this.speed = speed;
        this.duration = frames.length * speed;
    }

    public newInstance(): AnimationInstance {
        return new AnimationInstance(this);
    }
}

export class AnimationInstance {
    private readonly _definition: AnimationDefinition;
    private readonly _creationTime: number;

    public constructor(definition: AnimationDefinition) {
        this._definition = definition;
        this._creationTime = Date.now();
    }

    public getImage(): ImageBitmap {
        const age = Date.now() - this._creationTime;
        const frame = Math.floor(age / this._definition.speed) % this._definition.frames.length;
        return this._definition.frames[frame];
    }

    public render(context: CanvasRenderingContext2D, location: ILocation) {
        context.drawImage(this.getImage(), location.x, location.y);
    }

    public get definition() { return this._definition; }
}

export class AnimationRepository {
    private readonly _animations = new Map<string, AnimationDefinition>();

    public add(code: string, definition: AnimationDefinition) {
        this._animations.set(code, definition);
    }

    public get(code: string): AnimationDefinition | undefined {
        return this._animations.get(code);
    }
}