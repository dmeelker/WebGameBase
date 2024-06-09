
export class Color {
    public constructor(public r: number, public g: number, public b: number, public a: number) {
    }

    public get cssColor(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    public equals(other: Color): boolean {
        return this.r === other.r && this.g === other.g && this.b === other.b && this.a === other.a;
    }

    public static readonly white = new Color(255, 255, 255, 255);
}
