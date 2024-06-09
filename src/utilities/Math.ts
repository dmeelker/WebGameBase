export function interpolate(min: number, max: number, value: number) {
    return min + ((max - min) * value);
}

export function between(value: number, min: number, max: number) {
    return value >= min && value <= max;
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}