export class Settings {
    public sound: boolean;
    public ghosts: boolean;
    public spectators: boolean;
    public particles: boolean;

    constructor(sound = true, ghosts = true, spectators = true, particles = true) {
        this.sound = sound;
        this.ghosts = ghosts;
        this.spectators = spectators;
        this.particles = particles;
    }
}
