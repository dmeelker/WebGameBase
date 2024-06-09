import { Point, Size } from "./Trig";

export function setVisible(element: HTMLElement, visible: boolean) {
    element.style.display = visible ? "block" : "none";
}

export function hide(element: HTMLElement) {
    setVisible(element, false);
}

export function show(element: HTMLElement) {
    setVisible(element, true);
}

export function setSize(element: HTMLElement, size: Size) {
    element.style.width = size.width + "px";
    element.style.height = size.height + "px";
}

export function setLocation(element: HTMLElement, location: Point) {
    element.style.left = location.x + "px";
    element.style.top = location.y + "px";
}

export function position(element: HTMLElement, location: Point) {
    element.style.position = "absolute";
    element.style.left = location.x + "px";
    element.style.top = location.y + "px";
}

export function center(element: HTMLElement) {
    element.style.position = "absolute";
    element.style.left = "50%";
    element.style.top = "50%";
    element.style.transform = "translate(-50%, -50%)";
}

export function clear(element: HTMLElement) {
    element.innerHTML = "";
}

export function createDiv(text: string) {
    let element = document.createElement("div");
    element.innerHTML = text;
    return element;
}

export function setClass(element: HTMLElement, className: string, set: boolean) {
    if (set)
        element.classList.add(className);
    else
        element.classList.remove(className);
}