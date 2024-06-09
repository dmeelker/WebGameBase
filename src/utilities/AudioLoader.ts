import { AudioClip, AudioSystem, Music } from "./Audio";

export class AudioLoader {
    public readonly clipPath: string = "";
    public readonly musicPath: string = "";
    private readonly _audioSystem: AudioSystem;

    public constructor(clipPath: string, musicPath: string, audioSystem: AudioSystem) {
        this.clipPath = clipPath;
        this.musicPath = musicPath;
        this._audioSystem = audioSystem;
    }

    public async loadClip(url: string, instances: number): Promise<AudioClip> {
        let tasks = new Array<Promise<HTMLAudioElement>>();

        for (let i = 0; i < instances; i++) {
            tasks.push(this.loadSingle(this.getClipUrl(url)));
        }

        await Promise.all(tasks);

        let elements = new Array<HTMLAudioElement>();
        for (let i = 0; i < instances; i++) {
            elements.push(await tasks[i]);
        }

        return new AudioClip(elements, this._audioSystem);
    }

    public async loadMusic(url: string): Promise<Music> {
        let audio = await this.loadSingle(this.getMusicUrl(url));
        return new Music(audio, this._audioSystem);
    }

    private async loadSingle(url: string): Promise<HTMLAudioElement> {
        return new Promise<HTMLAudioElement>((resolve) => {
            const audio = new Audio();

            const eventHandler = () => {
                console.log(`Loaded ${url}`);
                resolve(audio);
                audio.removeEventListener("canplaythrough", eventHandler);
            };

            audio.addEventListener("canplaythrough", eventHandler);
            audio.addEventListener("error", () => console.error(`Failed to load ${url}`));
            audio.src = url;
        });
    }

    private getClipUrl(url: string): string {
        if (this.clipPath) {
            if (this.clipPath.endsWith("/")) {
                return this.clipPath + url;
            } else {
                return this.clipPath + "/" + url;
            }
        } else {
            return url;
        }
    }

    private getMusicUrl(url: string): string {
        if (this.musicPath) {
            if (this.musicPath.endsWith("/")) {
                return this.musicPath + url;
            } else {
                return this.musicPath + "/" + url;
            }
        } else {
            return url;
        }
    }
}