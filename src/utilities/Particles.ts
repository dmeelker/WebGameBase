import { Color } from "./Color";
import { FrameTime } from "./FrameTime";
import { interpolate } from "./Math";
import { randomInt } from "./Random";
import { Vector } from "./Trig";
import { Viewport } from "./Viewport";

export class NumberRange {
    public constructor(public min: number, public max: number) { }

    public randomValue() {
        return randomInt(this.min, this.max);
    }
}

export class ColorRange {
    public constructor(public min: Color, public max: Color) { }

    public interpolate(value: number) {
        return new Color(
            interpolate(this.min.r, this.max.r, value),
            interpolate(this.min.g, this.max.g, value),
            interpolate(this.min.b, this.max.b, value),
            interpolate(this.min.a, this.max.a, value),
        );
    }
}

export type ParticleCallback = (particle: Particle) => void;

export class ProjectileSettings {
    public angle: NumberRange = new NumberRange(0, 0);
    public velocity: NumberRange = new NumberRange(1, 1);
    public timeToLive: NumberRange = new NumberRange(1000, 1500);
    public minSize: NumberRange = new NumberRange(2, 2);
    public maxSize: NumberRange = new NumberRange(2, 2);
    public shape = ParticleShape.Square;
    public fromColor: Color = Color.white;
    public toColor: Color = Color.white;
    public gravity: Vector = Vector.zero;
    public callback?: ParticleCallback;

    public set color(color: Color) {
        this.fromColor = color;
        this.toColor = color;
    }

    public set size(size: number) {
        this.minSize = new NumberRange(size, size);
        this.maxSize = new NumberRange(size, size);
    }
}

export interface IEmitter {
    update(time: FrameTime): boolean;
}

export class Emitter implements IEmitter {
    private readonly _system: ParticleSystem;
    public location: Vector;
    public interval: number = 100;
    public count: NumberRange = new NumberRange(1, 1);
    public settings = new ProjectileSettings();
    public timeToLive: number = -1;

    private readonly _creationTime;
    private _lastEmissionTime: number = -100000;

    public constructor(location: Vector, time: FrameTime, system: ParticleSystem) {
        this.location = location;
        this._creationTime = time.currentTime;
        this._system = system;
    }

    public update(time: FrameTime): boolean {
        if (this.timeToLive > 0 && this.getAge(time) > this.timeToLive) {
            return false;
        }

        if (time.currentTime - this._lastEmissionTime >= this.interval) {
            this.emit(time);
        }

        return true;
    }

    private emit(time: FrameTime) {
        let count = this.count.randomValue();

        for (let i = 0; i < count; i++) {
            let particle = new Particle(this.location, new Color(255, 255, 255, 255), time);
            let angle = this.settings.angle.randomValue();
            let velocity = this.settings.velocity.randomValue();
            particle.shape = this.settings.shape;
            particle.gravity = this.settings.gravity;
            particle.velocity = Vector.fromDegreeAngle(angle).multiplyScalar(velocity);
            particle.timeToLive = this.settings.timeToLive.randomValue();

            let minSize = this.settings.minSize.randomValue();
            let maxSize = this.settings.maxSize.randomValue();
            particle.sizeRange = new NumberRange(Math.min(minSize, maxSize), Math.max(minSize, maxSize));

            particle.colorRange = new ColorRange(this.settings.fromColor, this.settings.toColor);

            if (this.settings.callback) {
                this.settings.callback(particle);
            }

            this._system.add(particle);
        }

        this._lastEmissionTime = time.currentTime;
    }

    private getAge(time: FrameTime) {
        return time.currentTime - this._creationTime;
    }
}

export class EmitterGroup implements IEmitter {
    private readonly _creationTime;
    private _emitters: IEmitter[] = [];
    public timeToLive: number = -1;

    public constructor(time: FrameTime) {
        this._creationTime = time.currentTime;
    }

    public update(time: FrameTime): boolean {
        if (this.timeToLive > 0 && this.getAge(time) > this.timeToLive) {
            return false;
        }

        this._emitters = this._emitters.filter(e => e.update(time));
        return true;
    }

    public add(emitter: IEmitter) {
        this._emitters.push(emitter);
    }

    public remove(emitter: IEmitter) {
        this._emitters = this._emitters.filter(e => e != emitter);
    }

    private getAge(time: FrameTime) {
        return time.currentTime - this._creationTime;
    }
}

export enum ParticleShape {
    Circle,
    Square,
}

export class Particle {
    private readonly _creationTime: number;
    public location: Vector;
    public velocity: Vector = Vector.zero;
    public gravity: Vector = Vector.zero;
    public shape = ParticleShape.Square;

    public size: number = 2;
    public sizeRange: NumberRange = new NumberRange(2, 2);
    public color: Color;
    public colorRange: ColorRange = new ColorRange(new Color(255, 255, 255, 255), new Color(255, 255, 255, 255));
    public timeToLive = 100;

    public constructor(location: Vector, color: Color, time: FrameTime) {
        this._creationTime = time.currentTime;
        this.location = location;
        this.color = color;
    }

    public update(time: FrameTime): boolean {
        if (this.passedTimeToLive(time)) {
            return false;
        }

        const lifeTimePassed = this.lifeTimePassed(time);
        this.updateSize(lifeTimePassed);
        this.color = this.colorRange.interpolate(lifeTimePassed);

        this.velocity = this.velocity.add(time.scaleVector(this.gravity));
        this.location = this.location.add(time.scaleVector(this.velocity));

        return true;
    }

    public render(viewport: Viewport) {
        viewport.context.fillStyle = this.color.cssColor;

        // Draw circle around this location of size size
        if (this.shape == ParticleShape.Circle) {
            viewport.context.beginPath();
            viewport.context.arc(this.location.x, this.location.y, this.size / 2, 0, 2 * Math.PI);
            viewport.context.fill();
        } else if (this.shape == ParticleShape.Square) {
            viewport.context.fillRect(Math.floor(this.location.x - (this.size / 2)), Math.floor(this.location.y - (this.size / 2)), Math.floor(this.size), Math.floor(this.size));
        }
    }

    public getAge(time: FrameTime) {
        return time.currentTime - this._creationTime;
    }

    private lifeTimePassed(time: FrameTime) {
        return this.getAge(time) / this.timeToLive;
    }

    public passedTimeToLive(time: FrameTime) {
        return this.getAge(time) > this.timeToLive;
    }

    private updateSize(lifeTimePassed: number) {
        this.size = interpolate(this.sizeRange.min, this.sizeRange.max, lifeTimePassed);
    }
}

export class ParticleSystem {
    private _particles: Particle[] = [];
    private _emitters: IEmitter[] = [];

    public clear() {
        this._particles = [];
        this._emitters = [];
    }

    public add(particle: Particle) {
        this._particles.push(particle);
    }

    public update(time: FrameTime) {
        for (let emitter of this._emitters) {
            if (!emitter.update(time)) {
                this.removeEmitter(emitter);
            }
        }

        this._particles = this._particles.filter(p => p.update(time));
    }

    public render(viewport: Viewport) {
        for (let particle of this._particles) {
            particle.render(viewport);
        }
    }

    public addEmitter(emitter: IEmitter) {
        this._emitters.push(emitter);
    }

    public removeEmitter(emitter: IEmitter) {
        this._emitters = this._emitters.filter(e => e !== emitter);
    }
}