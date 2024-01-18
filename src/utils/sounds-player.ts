import { Sound } from "excalibur";

export class SoundPlayer {
    public sound = true;

    public playSound(sound: Sound, volume: number, loop = false): void {
        if (this.sound) {
            sound.loop = loop;
            sound.play(volume);
        }
    }

    public stopSound(sound: Sound): void {
        sound.stop();
    }

    public toggleSound(): void {
        this.sound = !this.sound;
    }
}