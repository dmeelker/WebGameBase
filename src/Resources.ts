import { Font } from "./Font";
import { AnimationDefinition } from "./utilities/Animation";
import { AudioClip, AudioSystem, Music } from "./utilities/Audio";
import { AudioLoader } from "./utilities/AudioLoader";
import { ImageLoader } from "./utilities/ImagesLoader";
import { SpriteSheetLoader } from "./utilities/SpriteSheetLoader";

export interface ImageResources {
    background: ImageBitmap;
    cat: ImageBitmap;
}

export interface AudioResources {
    step: AudioClip;
    music: Music;
}

interface IAudioResourceSpec {
    [name: string]: IAudioFile
}

interface IAudioFile {
    name: string;
    instances: number;
}

export interface AnimationResources {
    cat: AnimationDefinition,
}

export interface Fonts {
    small: Font;
    default: Font;
    large: Font;
    redDefault: Font;
}

export class Resources {
    public constructor(
        public readonly images: ImageResources,
        public readonly audio: AudioResources,
        public readonly animations: AnimationResources,
        public readonly fonts: Fonts) { }
}

export class ResourceLoader {
    private readonly _audioSystem: AudioSystem;

    public constructor(audioSystem: AudioSystem) {
        this._audioSystem = audioSystem;
    }

    public async load(): Promise<Resources> {
        const imageLoader = new ImageLoader("assets/gfx");

        let images = {
            background: await imageLoader.load("background.png"),
            cat: await imageLoader.load("cat.png"),
        };

        let audio = await this.loadAudioResources();

        let animations = {
            cat: new AnimationDefinition(await new SpriteSheetLoader().cutSpriteSheet(images.cat, 6, 1), 200),
        };

        let fonts = {
            small: new Font(await imageLoader.load("font_small.png"), 1),
            default: new Font(await imageLoader.load("font_default.png"), 2),
            large: new Font(await imageLoader.load("font_large.png"), 3),
            redDefault: new Font(await imageLoader.load("font_red_default.png"), 2),
        };

        return new Resources(images, audio, animations, fonts);
    }

    private async loadAudioResources(): Promise<AudioResources> {
        const loader = new AudioLoader("assets/sounds", "assets/music", this._audioSystem);

        let audio = await this.loadAudioFiles(
            {
                step: { name: "step.wav", instances: 1 },
            },
            file => loader.loadClip(file.name, file.instances));

        audio.music = await loader.loadMusic("the_field_of_dreams.mp3");
        return audio;
    }

    private async loadAudioFiles(definition: IAudioResourceSpec, loader: (file: IAudioFile) => Promise<AudioClip>): Promise<AudioResources> {
        let tasks = new Map<string, Promise<AudioClip>>();
        for (let key in definition) {
            tasks.set(key, loader(definition[key]));
        }
        await Promise.all(tasks.values());

        let result: any = {};
        for (let [key, value] of tasks) {
            result[key] = await value;
        }

        return result;
    }
}