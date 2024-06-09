import { Rectangle, Size, Vector } from "./Trig";

export function randomInt(min: number, max: number): number {
    return Math.floor(min + (Math.random() * (max - min)));
}

export function randomArrayIndex<T>(array: Array<T>): number {
    return randomInt(0, array.length);
}

export function randomArrayElement<T>(array: Array<T>): T {
    return array[randomArrayIndex(array)];
}

export function randomWeightedArrayElement<T>(array: Array<T>, weightSelector: (item: T) => number): T {
    let totalWeight = array.reduce((sum, x) => sum + weightSelector(x), 0);

    let randomWeight = randomInt(0, totalWeight);
    let currentWeight = 0;

    for (let item of array) {
        currentWeight += weightSelector(item);
        if (currentWeight >= randomWeight) {
            return item;
        }
    }

    throw new Error("Could not find a random weighted element");
}

export function chance(value: number): boolean {
    return randomInt(0, 100) <= value;
}

export function randomLocation(area: Rectangle, size: Size): Vector {
    return new Vector(area.x + randomInt(0, area.width - size.width), area.y + randomInt(0, area.height - size.height));
}