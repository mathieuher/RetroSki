import { Sound } from 'excalibur';

export class SoundPlayer {
	public sound = true;
	private soundMuteButton: HTMLElement = document.getElementById('sound-mute-button')!;
	private soundButton: HTMLElement = document.getElementById('sound-button')!;

	constructor() {
		this.soundButton.addEventListener('click', () => {
			this.changeSound(true);
		});

		this.soundMuteButton.addEventListener('click', () => {
			this.changeSound(false);
		});
	}

	public showButton(): void {
		if (this.sound) {
			this.soundMuteButton.style.display = 'inline';
			this.soundButton.style.display = 'none';
		} else {
			this.soundButton.style.display = 'inline';
			this.soundMuteButton.style.display = 'none';
		}
	}

	public hideButton(): void {
		this.soundMuteButton.style.display = 'none';
		this.soundButton.style.display = 'none';
	}

	public playSound(sound: Sound, volume: number, loop = false, playMultiple = true): void {
		if (this.sound && (!sound.isPlaying() || playMultiple)) {
			sound.loop = loop;
			sound.play(volume);
		} else if (this.sound && sound.isPlaying() && volume !== sound.volume) {
			sound.volume = volume;
		}
	}

	public stopSound(sound: Sound): void {
		sound.stop();
	}

	private changeSound(value: boolean): void {
		this.sound = value;
		this.showButton();
	}
}
