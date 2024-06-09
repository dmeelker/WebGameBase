export class ImageLoader {
    public basePath: string = "";

    public constructor(basePath?: string) {
        this.basePath = basePath ?? "";
    }

    public async load(url: string): Promise<ImageBitmap> {
        const image = await this.loadImage(this.getImageUrl(url));
        return image;
    }

    private getImageUrl(url: string): string {
        if (this.basePath) {
            if (this.basePath.endsWith("/")) {
                return this.basePath + url;
            } else {
                return this.basePath + "/" + url;
            }
        } else {
            return url;
        }
    }

    private loadImage(url: string): Promise<ImageBitmap> {
        return new Promise<ImageBitmap>((resolve) => {
            let image = new Image();
            image.addEventListener('load', async () => {
                console.log('Loaded ' + url);
                resolve(await window.createImageBitmap(image));
            }, false);

            image.src = url;
        });
    }
}