import { Color } from "./Color";
import { Rectangle } from "./Trig";

class Slice {
    public color: Color;
    public x: number;
    public y: number;
    public width: number;

    public constructor(color: Color, x: number, y: number, width: number) {
        this.color = color;
        this.x = x;
        this.y = y;
        this.width = width;
    }
}

export class Block {
    public color: Color;
    public rectangle: Rectangle;

    public constructor(color: Color, rectangle: Rectangle) {
        this.color = color;
        this.rectangle = rectangle;
    }
}

export class ImageBlockScanner {
    public loadBlocks(image: ImageBitmap): Block[] {
        let imageData = this.loadImageData(image);
        let slices = this.scanSlices(imageData);
        return this.collectBlocks(slices);
    }

    private scanSlices(imageData: ImageData): Slice[] {
        let slices = new Array<Slice>();

        let sliceStart = 0;
        let sliceColor = new Color(0, 0, 0, 0);
        let inSlice = false;

        let collectSlice = (x: number, y: number) => {
            slices.push(new Slice(sliceColor, sliceStart, y, x - sliceStart));
            inSlice = false;
        }

        for (let y = 0; y < imageData.height; y++) {
            for (let x = 0; x < imageData.width; x++) {
                const color = this.readColor(imageData, x, y);

                if (color.a > 0) {
                    if (inSlice && !color.equals(sliceColor)) {
                        collectSlice(x, y);
                    }

                    if (!inSlice) {
                        sliceColor = color;
                        sliceStart = x;
                        inSlice = true;
                    }
                } else {
                    if (inSlice) {
                        collectSlice(x, y);
                    }
                }
            }

            if (inSlice) {
                collectSlice(imageData.width, y);
            }
        }

        return slices;
    }

    private readColor(imageData: ImageData, x: number, y: number): Color {
        const index = (y * (imageData.width * 4)) + (x * 4);
        return new Color(imageData.data[index], imageData.data[index + 1], imageData.data[index + 2], imageData.data[index + 3]);
    }

    private collectBlocks(slices: Slice[]): Block[] {
        let blocks = new Array<Block>();

        while (slices.length > 0) {
            let stack = this.findSliceStack(slices[0], slices);
            slices = slices.filter(s => stack.indexOf(s) == -1);

            let color = stack[0].color;
            let x = stack[0].x;
            let y = stack[0].y;
            let width = stack[0].width;
            let height = stack[stack.length - 1].y - y + 1;

            blocks.push(new Block(color, new Rectangle(x, y, width, height)));
        }

        return blocks;
    }

    private findSliceStack(start: Slice, slices: Slice[]): Slice[] {
        let stack = new Array<Slice>();
        stack.push(start);

        let slice = start;
        while (true) {
            let below = this.findSliceBelow(slice, slices);
            if (below == null)
                break;
            stack.push(below);
            slice = below;
        }

        return stack;
    }

    private findSliceBelow(slice: Slice, slices: Slice[]): Slice | null {
        let below = slices.filter(s => s.y == slice.y + 1 && s.x == slice.x && s.width == slice.width && s.color.equals(slice.color));
        if (below.length == 0)
            return null;
        return below[0];
    }

    private loadImageData(image: ImageBitmap): ImageData {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        let context = canvas.getContext("2d")!;
        context.drawImage(image, 0, 0);
        let imageData = context.getImageData(0, 0, image.width, image.height);
        return imageData;
    }
}