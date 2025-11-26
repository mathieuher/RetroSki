export class Settings {
    public sound: boolean;
    public touchZones: boolean;
    public ghosts: boolean;
    public spectators: boolean;
    public spectatorsAnimation: boolean;
    public particles: boolean;
    public decorations: boolean;
    public sideIndicators: boolean;
    public snowColors: boolean;

    constructor(
        sound = true,
        touchZones = false,
        ghosts = true,
        spectators = true,
        spectatorsAnimation = true,
        particles = true,
        decorations = true,
        sideIndicators = true,
        snowColors = true
    ) {
        this.sound = sound;
        this.touchZones = touchZones;
        this.ghosts = ghosts;
        this.spectators = spectators;
        this.spectatorsAnimation = spectatorsAnimation;
        this.particles = particles;
        this.decorations = decorations;
        this.sideIndicators = sideIndicators;
        this.snowColors = snowColors;
    }
}
