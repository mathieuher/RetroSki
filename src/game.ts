import { Color, DisplayMode, Engine, Loader } from "excalibur";
import { Resources } from "./resources";
import { Config } from "./config";
import { Race } from "./scenes/race";

class Game extends Engine {

    private resourcesToLoad = [
        Resources.Skier,
        Resources.SkierCarving,
        Resources.SkierSliding,
        Resources.SkierBraking,
        Resources.SkierJumping
    ];

    /*
    private skier?: Skier;
    private gates: Gate[] = [];

    // UI
    private speedometerUi = document.getElementById('speedometer')!;
    private timerUi = document.getElementById('timer')!;
    private uiTimer = new Timer({
        interval: 10,
        fcn: () => this.updateUi(),
        repeats: true
    });
    private startTime?: number;
    private endTime?: number;

    */

    constructor() {
        super({ displayMode: DisplayMode.FitContainer, backgroundColor: Color.White, fixedUpdateFps: 60, canvasElementId: 'game' });
    }

    initialize() {
        this.addScene('race', new Race(this));

        const loader = new Loader(this.resourcesToLoad);
        this.start(loader);

        this.goToScene('race');

        /*
        this.skier = new Skier(this);
        this.add(this.skier);
        this.buildTrack();

        const loader = new Loader(this.resourcesToLoad);
        this.start(loader);

        this.addTimer(this.uiTimer);
        this.uiTimer.start();
        */
    }

    onPreUpdate(_engine: Engine, _delta: number): void {
        if (_engine.input.keyboard.wasPressed(Config.DEBUG_KEY)) {
            _engine.showDebug(!_engine.isDebug);
        }

        // this.setTrackVelocity(this.skier ? this.skier.speed : 0);
    }

    /*
    
        public stopRace(): void {
            this.endTime = this.clock.now();
            this.skier!.racing = false;
        }
    
        private showUi(): void {
            this.speedometerUi.style.visibility = 'visible';
            this.timerUi.style.visibility = 'visible';
        }
    
        private updateUi(): void {
            if (this.speedometerUi.style.visibility !== 'visible') {
                this.showUi();
            }
            this.updateSpeedometer();
            this.updateTiming();
        }
    
        private updateSpeedometer(): void {
            if (this.skier) {
                this.speedometerUi!.innerText = Math.floor(this.skier!.speed) + ' km/h';
            }
        }
    
        private updateTiming(): void {
            if (!this.startTime) {
                this.startTime = this.clock.now();
            } else if (this.startTime && !this.endTime) {
                this.timerUi!.innerText = `${format(this.clock.now() - this.startTime, 'mm:ss:SS')}`;
            }
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
    
            this.generateFinalGate(nextGatePosition.y);
        }
    
        private generateFinalGate(verticalPosition: number): void {
            const finalGate = new Gate(vec(Config.FINAL_GATE_POSITION, verticalPosition), Color.Yellow, this.gates.length, true);
            this.add(finalGate);
            this.gates.push(finalGate);
    
            finalGate.on('stoprace', () => this.stopRace());
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
    
        */
}

export const game = new Game();
game.initialize();