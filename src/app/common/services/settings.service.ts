import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';
import { StorageManager } from '../../game/utils/storage-manager';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private static SOUND_KEY = 'settings_sound';
    private static TOUCH_ZONES_KEY = 'settings_touch_zones';
    private static GHOSTS_KEY = 'settings_ghost';
    private static SPECTATORS_KEY = 'settings_spectators';
    private static SPECTATORS_ANIMATION_KEY = 'settings_spectators_animation';
    private static PARTICLES_KEY = 'settings_particles';
    private static DECORATIONS_KEY = 'settings_decorations';
    private static SIDE_INDICATORS_KEY = 'settings_side_indicators';

    private settings: Settings;

    constructor() {
        this.settings = new Settings(
            localStorage.getItem(SettingsService.SOUND_KEY) !== 'false',
            localStorage.getItem(SettingsService.TOUCH_ZONES_KEY) === 'true',
            localStorage.getItem(SettingsService.GHOSTS_KEY) !== 'false',
            localStorage.getItem(SettingsService.SPECTATORS_KEY) !== 'false',
            localStorage.getItem(SettingsService.SPECTATORS_ANIMATION_KEY) !== 'false',
            localStorage.getItem(SettingsService.PARTICLES_KEY) !== 'false',
            localStorage.getItem(SettingsService.DECORATIONS_KEY) !== 'false',
            localStorage.getItem(SettingsService.SIDE_INDICATORS_KEY) !== 'false'
        );
        this.settings;
    }

    public resetSettings(): void {
        this.settings = new Settings();
    }

    public getSettings(): Settings {
        return this.settings;
    }

    public setSound(value: boolean): void {
        this.settings.sound = value;
    }

    public setGhosts(value: boolean): void {
        this.settings.ghosts = value;
        StorageManager.save(SettingsService.GHOSTS_KEY, value ? 'true' : 'false');
    }

    public persistSettings(): void {
        StorageManager.save(SettingsService.SOUND_KEY, this.settings.sound ? 'true' : 'false');
        StorageManager.save(SettingsService.TOUCH_ZONES_KEY, this.settings.touchZones ? 'true' : 'false');
        StorageManager.save(SettingsService.SPECTATORS_KEY, this.settings.spectators ? 'true' : 'false');
        StorageManager.save(
            SettingsService.SPECTATORS_ANIMATION_KEY,
            this.settings.spectatorsAnimation ? 'true' : 'false'
        );
        StorageManager.save(SettingsService.GHOSTS_KEY, this.settings.ghosts ? 'true' : 'false');
        StorageManager.save(SettingsService.PARTICLES_KEY, this.settings.particles ? 'true' : 'false');
        StorageManager.save(SettingsService.DECORATIONS_KEY, this.settings.decorations ? 'true' : 'false');
        StorageManager.save(SettingsService.SIDE_INDICATORS_KEY, this.settings.sideIndicators ? 'true' : 'false');
    }
}
