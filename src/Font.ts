import { ILocation, Size } from "./utilities/Trig";
import { Viewport } from "./utilities/Viewport";

interface IFontData {
    [char: string]: number[]
}

const FontData = {
    'A': [0, 0, 11, 13],
    'B': [13, 0, 11, 13],
    'C': [26, 0, 11, 13],
    'D': [40, 0, 11, 13],
    'E': [53, 0, 11, 13],
    'F': [66, 0, 11, 13],
    'G': [79, 0, 12, 13],
    'H': [93, 0, 11, 13],
    'I': [106, 0, 11, 13],
    'J': [119, 0, 11, 13],

    'K': [0, 15, 12, 13],
    'L': [14, 15, 11, 13],
    'M': [28, 15, 13, 13],
    'N': [44, 15, 11, 13],
    'O': [57, 15, 11, 13],
    'P': [71, 15, 11, 13],
    'Q': [84, 15, 12, 15],
    'R': [98, 15, 11, 13],
    'S': [112, 15, 11, 13],
    'T': [125, 15, 10, 13],

    'U': [0, 30, 11, 13],
    'V': [13, 30, 11, 13],
    'W': [27, 30, 13, 13],
    'X': [43, 30, 11, 13],
    'Y': [57, 30, 12, 13],
    'Z': [71, 30, 11, 13],

    '!': [87, 30, 4, 13],

    '1': [0, 45, 3, 14],
    '2': [5, 45, 11, 14],
    '3': [18, 45, 11, 14],
    '4': [31, 45, 11, 14],
    '5': [44, 45, 11, 14],
    '6': [58, 45, 11, 14],
    '7': [71, 45, 11, 14],
    '8': [84, 45, 11, 14],
    '9': [97, 45, 11, 14],
    '0': [111, 45, 11, 14],
};

export class Font {
    private image: ImageBitmap;
    private data: IFontData = {};
    private _spaceSize: number;

    constructor(image: ImageBitmap, scale: number, data: IFontData = FontData) {
        this.image = image;
        this._spaceSize = 5 * scale;

        for (let key in data) {
            let values = data[key];
            this.data[key] = values.map(value => value * scale);
        }
    }

    public renderCenteredInArea(viewport: Viewport, text: string, y: number, containerWidth: number) {
        this.render(viewport, text, { x: Math.floor((containerWidth / 2) - (this.calculateSize(text).width / 2)), y: y });
    }

    public renderCenteredOnPoint(viewport: Viewport, text: string, location: ILocation) {
        let size = this.calculateSize(text);
        this.render(viewport, text, { x: location.x - (size.width / 2), y: location.y - (size.height / 2) });
    }

    public render(viewport: Viewport, text: string, location: ILocation) {
        let currentX = location.x;

        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);

            if (this.data[char] != undefined) {
                let charData = this.data[char];
                viewport.context.drawImage(this.image, charData[0], charData[1], charData[2], charData[3], currentX, location.y - charData[3], charData[2], charData[3]);

                currentX += charData[2] + 2;
            } else if (char == ' ') {
                currentX += this._spaceSize;
            }
        }
    }

    public calculateSize(text: string) {
        let width = 0;
        let height = 0;

        for (let i = 0; i < text.length; i++) {
            let char = text.charAt(i);

            if (this.data[char] != undefined) {
                let charData = this.data[char];

                height = Math.max(height, charData[3]);
                width += charData[2] + 2;
            } else if (char == ' ') {
                width += 5;
            }
        }

        return new Size(width, height);
    }
}