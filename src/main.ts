import { Actor, Color, DisplayMode, Engine, ExcaliburGraphicsContext, Line, Loader, Text, Vector, vec } from "excalibur";
import { Player } from "./player";
import { Resources } from "./resources";
import { Gate } from "./gate";
import { Config } from "./config";
import { Lines } from "./lines";

class Game extends Engine {

    private resourcesToLoad = [
        Resources.Skier,
        Resources.SkierCarving,
        Resources.SkierSliding,
        Resources.SkierBraking,
        Resources.SkierJumping
    ];

    private skier?: Player;
    private lines?: Lines;
    private previousSkierPos = vec(0, 0);
    private currentSkierPos = vec(0, 0);

    private gates: Gate[] = [];

    constructor() {
        super({ width: 800, height: 600, backgroundColor: Color.White, displayMode: DisplayMode.FitScreen, fixedUpdateFps: 40 });
    }
    initialize() {
        this.skier = new Player(this);
        this.lines = new Lines(this, this.previousSkierPos);
        this.add(this.skier);
        this.add(this.lines);

        this.buildTrack();

        const loader = new Loader(this.resourcesToLoad);
        this.start(loader);
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        this.setTrackVelocity(this.skier ? this.skier.speed : 0);
    }

    private buildTrack(): void {
        let nextGatePosition = this.getNextGatePosition(1);
        const numberOfGates = Math.floor(Config.GATE_MIN_NUMBER + (Math.random() * (Config.GATE_MAX_NUMBER - Config.GATE_MIN_NUMBER)));
        console.log('Build a track of ', numberOfGates, ' gates');
        for (let index = 0; index < numberOfGates; index++) {
            const gate = new Gate(this, nextGatePosition, index % 2 > 0 ? Color.Red : Color.Blue, index + 1);
            this.add(gate);
            this.gates.push(gate);
            nextGatePosition = this.getNextGatePosition(index + 2, nextGatePosition);
        }
    }

    private getNextGatePosition(gateNumber: number, currentGatePosition?: Vector): Vector {
        if (!currentGatePosition) {
            return vec(Config.GATE_MAX_LEFT_POSITION + (Math.random() * (Config.GATE_MAX_RIGHT_POSITION - Config.GATE_MAX_LEFT_POSITION)), Config.GATE_FIRST_DISTANCE);
        } else {
            const isNextLeft = gateNumber % 2 > 0;
            const nextHorizontalDistance = Config.GATE_MIN_HORIZONTAL_DISTANCE + (Math.random() * (Config.GATE_MAX_HORIZONTAL_DISTANCE - Config.GATE_MAX_HORIZONTAL_DISTANCE));
            const nextHorizontalPosition = isNextLeft ? Math.max(Config.GATE_MAX_LEFT_POSITION, currentGatePosition.x - nextHorizontalDistance) : Math.min(Config.GATE_MAX_RIGHT_POSITION, currentGatePosition.x + nextHorizontalDistance);
            const nextVerticalPosition = currentGatePosition.y - (Config.GATE_MIN_VERTICAL_DISTANCE + (Math.random() * (Config.GATE_MAX_VERTICAL_DISTANCE - Config.GATE_MIN_VERTICAL_DISTANCE)));
            return vec(nextHorizontalPosition, nextVerticalPosition);
        }

    }

    private setTrackVelocity(speed: number): void {
        const verticalVelocity = speed * Config.GATE_VELOCITY_RATE;
        this.gates.forEach(gate => {
            gate.vel.y = verticalVelocity;
        });
    }
}

export const game = new Game();
game.initialize();