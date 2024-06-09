export interface ILocation {
    get x(): number;
    get y(): number;
}

export class Point implements ILocation {
    constructor(public x: number, public y: number) {

    }

    public static fromVector(vector: Vector): Point {
        return new Point(vector.x, vector.y);
    }

    public toVector(): Vector {
        return new Vector(this.x, this.y);
    }

    public add(other: Point | Vector): Point {
        return new Point(this.x + other.x, this.y + other.y);
    }

    public subtract(other: Point): Vector {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    public distanceTo(other: Point): number {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    public round(): Point {
        return new Point(Math.round(this.x), Math.round(this.y));
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }
}

export class Size {
    constructor(public width: number, public height: number) { }

    public getScaleFactor(destSize: Size): number {
        const srcAspectRatio = this.width / this.height;
        const destAspectRatio = destSize.width / destSize.height;

        let scaleFactor;

        if (srcAspectRatio > destAspectRatio) {
            // Source rectangle is wider than destination rectangle
            scaleFactor = destSize.width / this.width;
        } else {
            // Source rectangle is taller than or equal to destination rectangle
            scaleFactor = destSize.height / this.height;
        }

        return scaleFactor;
    }
}

export class Rectangle {
    public location: Point;
    public size: Size;

    public get x(): number {
        return this.location.x;
    }

    public get y(): number {
        return this.location.y;
    }

    public get width(): number {
        return this.size.width;
    }

    public get height(): number {
        return this.size.height;
    }

    public get center(): Point {
        return new Point(this.x + (this.width / 2), this.y + (this.height / 2));
    }

    constructor(x: number, y: number, width: number, height: number) {
        this.location = new Point(x, y);
        this.size = new Size(width, height);
    }

    public overlaps(other: Rectangle): boolean {
        if (other.location.x + other.size.width <= this.location.x) return false;
        if (other.location.x >= this.location.x + this.size.width) return false;
        if (other.location.y + other.size.height <= this.location.y) return false;
        if (other.location.y >= this.location.y + this.size.height) return false;

        return true;
    }

    public containsPoint(p: ILocation) {
        return p.x >= this.location.x && p.x < this.location.x + this.size.width &&
            p.y >= this.location.y && p.y < this.location.y + this.size.height;
    }

    public containsRect(rect: Rectangle): boolean {
        return rect.x >= this.x &&
            rect.x + rect.width <= this.x + this.width &&
            rect.y >= this.y &&
            rect.y + rect.height <= this.y + this.height;
    }

    public addBorder(size: number): Rectangle {
        return new Rectangle(this.location.x - size, this.location.y - size, this.size.width + (size * 2), this.size.height + (size * 2));
    }

    translate(v: Vector) {
        return new Rectangle(this.x + v.x, this.y + v.y, this.width, this.height);
    }

    public halfSize(): Rectangle {
        return new Rectangle(this.x, this.y, this.width / 2, this.height / 2);
    }
}

export class Vector implements ILocation {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public get length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public distanceTo(other: ILocation) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }

    public add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    public addY(y: number) {
        return new Vector(this.x, this.y + y);
    }

    public addX(x: number) {
        return new Vector(this.x + x, this.y);
    }

    public subtract(vector: Vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    public multiplyScalar(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    public floor() {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }

    public toUnit() {
        let length = this.length;

        return new Vector(this.x / length, this.y / length);
    }

    public get angleInRadians(): number {
        return Math.atan2(this.y, this.x);
    }

    public get angleInDegrees(): number {
        return radiansToDegrees(this.angleInRadians);
    }

    static interpolate(v1: Vector, v2: Vector, amount: number) {
        return new Vector(
            v1.x + ((v2.x - v1.x) * amount),
            v1.y + ((v2.y - v1.y) * amount));
    }

    static fromRadianAngle(radians: number): Vector {
        return new Vector(
            Math.cos(radians),
            Math.sin(radians));
    }

    static fromDegreeAngle(degrees: number): Vector {
        return this.fromRadianAngle(degreesToRadians(degrees));
    }

    public mirrorX(condition: boolean = true): Vector {
        if (!condition)
            return this.clone();
        ;
        return new Vector(this.x * -1, this.y);
    }

    public clone() {
        return new Vector(this.x, this.y);
    }

    static get zero() {
        return new Vector(0, 0);
    }

    static get left() {
        return new Vector(-1, 0);
    }

    static get right() {
        return new Vector(1, 0);
    }
}

export function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

export function radiansToDegrees(radians: number): number {
    return radians * (180 / Math.PI);
}

export function normalizeDegrees(degrees: number): number {
    degrees = degrees % 360;

    if (degrees < 0) {
        degrees += 360;
    }

    return degrees;
}
