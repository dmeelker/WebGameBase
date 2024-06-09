import { Point, Size } from "./Trig";

export function center(containerSize: number, childSize: number) {
    return (containerSize / 2) - (childSize / 2);
}

export function centerSizes(containerSize: Size, childSize: Size): Point {
    return new Point(
        center(containerSize.width, childSize.width),
        center(containerSize.height, childSize.height)
    );
}