export class Settings {
    public sound: boolean;
    public ghosts: boolean;
    public spectators: boolean;
    public spectatorsAnimation: boolean;
    public particles: boolean;

    constructor(sound = true, ghosts = true, spectators = true, spectatorsAnimation = true, particles = true) {
        this.sound = sound;
        this.ghosts = ghosts;
        this.spectators = spectators;
        this.spectatorsAnimation = spectatorsAnimation;
        this.particles = particles;
    }
}
