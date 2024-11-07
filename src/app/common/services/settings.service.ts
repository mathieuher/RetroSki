import { Injectable } from '@angular/core';
import { Settings } from '../models/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
    private settings = new Settings();

    public getSettings(): Settings {
        return this.settings;
    }

    public setSound(value: boolean): void {
        this.settings.sound = value;
    }

    public setSpectators(value: boolean): void {
        this.settings.spectators = value;
    }

    public setGhosts(value: boolean): void {
        this.settings.ghosts = value;
    }

    public setParticles(value: boolean): void {
        this.settings.particles = value;
    }

    public restoreSettings(): void {
        this.settings = new Settings();
    }
    
}
