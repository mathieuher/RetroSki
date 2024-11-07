import { Sound } from 'excalibur';
import { SettingsService } from '../../common/services/settings.service';

export class SoundPlayer {
    private settingsService: SettingsService;

	constructor(settingsService: SettingsService) {
		this.settingsService = settingsService;
	}

	public playSound(sound: Sound, volume: number, loop = false, playMultiple = true): void {
		const soundsEnabled = this.settingsService.getSettings().sound;
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
