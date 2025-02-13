export class Settings {
    public sound: boolean;
    public ghosts: boolean;
    public spectators: boolean;
    public spectatorsAnimation: boolean;
    public particles: boolean;
    public decorations: boolean;
    public sideIndicators: boolean;

    constructor(
        sound = true,
        ghosts = true,
        spectators = true,
        spectatorsAnimation = true,
        particles = true,
        decorations = true,
        sideIndicators = true
    ) {
        this.sound = sound;
        this.ghosts = ghosts;
        this.spectators = spectators;
        this.spectatorsAnimation = spectatorsAnimation;
        this.particles = particles;
        this.decorations = decorations;
        this.sideIndicators = sideIndicators;
    }
}
