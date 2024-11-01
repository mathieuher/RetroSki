import { Sound } from 'excalibur';
import { GameSetupManager } from './game-setup-manager';

export class SoundPlayer {
	public gameSetupManager: GameSetupManager;

	constructor(gameSetupManager: GameSetupManager) {
		this.gameSetupManager = gameSetupManager;
	}

	public playSound(sound: Sound, volume: number, loop = false, playMultiple = true): void {
		const soundsEnabled = this.gameSetupManager.getGameSetup().sounds;
		if (soundsEnabled && (!sound.isPlaying() || playMultiple)) {
			sound.loop = loop;
			sound.play(volume);
		} else if (soundsEnabled && sound.isPlaying() && volume !== sound.volume) {
			sound.volume = volume;
		}
	}

	public stopSound(sound: Sound): void {
		sound.stop();
	}
}
