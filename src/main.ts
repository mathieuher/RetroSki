import { Color, DisplayMode, Engine, Keys, Loader, Vector, vec } from "excalibur";
import { Player } from "./player";
import { Resources } from "./resources";
import { Gate } from "./gate";
import { Config } from "./config";

class Game extends Engine {

    private resourcesToLoad = [
        Resources.Skier,
        Resources.SkierCarving,
        Resources.SkierSliding,
        Resources.SkierBraking,
        Resources.SkierJumping
    ];

    private skier?: Player;

    private gates: Gate[] = [];

    constructor() {
        super({ displayMode: DisplayMode.FitContainer, backgroundColor: Color.White, fixedUpdateFps: 60, canvasElementId: 'game' });
    }

    initialize() {
        this.skier = new Player(this);

        this.add(this.skier);

        this.buildTrack();

        const loader = new Loader(this.resourcesToLoad);
        this.start(loader);
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.DEBUG_KEY)) {
            _engine.showDebug(!_engine.isDebug);
        }

        this.setTrackVelocity(this.skier ? this.skier.speed : 0);
    }

    private buildTrack(): void {
        let nextGatePosition = this.getNextGatePosition(1);
        const numberOfGates = Math.floor(Config.GATE_MIN_NUMBER + (Math.random() * (Config.GATE_MAX_NUMBER - Config.GATE_MIN_NUMBER)));
        console.log('Build a track of ', numberOfGates, ' gates');
        for (let index = 0; index < numberOfGates; index++) {
            const gate = new Gate(nextGatePosition, index % 2 > 0 ? Color.Red : Color.Blue, index + 1);
            this.add(gate);
            this.gates.push(gate);
            nextGatePosition = this.getNextGatePosition(index + 2, nextGatePosition);
        }
    }

    private getNextGatePosition(gateNumber: number, currentGatePosition?: Vector): Vector {
        if (!currentGatePosition) {
            return vec(Config.GATE_MAX_LEFT_POSITION + (Math.random() * ((Config.GATE_MAX_RIGHT_POSITION - Config.GATE_MAX_LEFT_POSITION) * 0.3)), Config.GATE_FIRST_DISTANCE);
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