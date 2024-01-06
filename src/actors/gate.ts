import { Actor, Color, Vector, vec } from "excalibur";
import { Config } from "../config";
import { Pole } from "./pole";
import { GateDetector } from "./gate-detector";
import { Race } from "../scenes/race";

export class Gate extends Actor {

    public isFinalGate!: boolean
    private leftPole?: Pole;
    private rightPole?: Pole;
    private gateDetector?: GateDetector;
    private gateNumber?: number;
    private polesColor: Color;

    static getRandomGateWidth(): number {
        return Config.GATE_MIN_WIDTH + (Math.random() * (Config.GATE_MAX_WIDTH - Config.GATE_MIN_WIDTH));
    }

    constructor(position: Vector, color: Color, gateNumber?: number, isFinalGate = false) {
        super({
            pos: position,
            width: isFinalGate ? Config.FINAL_GATE_WIDTH : Gate.getRandomGateWidth(),
            height: isFinalGate ? Config.FINAL_POLE_HEIGHT : Config.POLE_HEIGHT,
            anchor: vec(0, 0.5)
        });

        this.isFinalGate = isFinalGate;
        this.polesColor = color;
        this.gateNumber = gateNumber;
    }

    onInitialize() {
        this.on('passed', () => {
            if (this.isFinalGate) {
                (this.scene as Race).stopRace();
            } else {
                this.children.forEach(child => {
                    (child as Actor).color = Color.Green
                });
            }
        })


    }

    update(): void {
        if (this.isOnScreen() && !this.children.length) {
            this.buildComponents();
        }

        if (this.canBeDestroy()) {
            this.kill();
        }
    }

    private isOnScreen(): boolean {
        return Math.abs(this.scene.camera.y - this.pos.y) < Config.DISPLAY_HEIGHT;
    }

    private canBeDestroy(): boolean {
        return this.scene.camera.y - this.pos.y < - Config.DISPLAY_HEIGHT;
    }

    private buildComponents(): void {
        console.log('buildGate : ', this.gateNumber);
        const gatePoleWidth = this.isFinalGate ? Config.FINAL_POLE_WIDTH : Config.POLE_WIDTH;

        this.leftPole = new Pole(vec(0, 0), this.polesColor, this.isFinalGate);
        this.gateDetector = new GateDetector(vec(gatePoleWidth, 0), this.width - (2 * gatePoleWidth), this.isFinalGate);
        this.rightPole = new Pole(vec(this.width - gatePoleWidth, 0), this.polesColor, this.isFinalGate);

        this.addChild(this.leftPole!);
        this.addChild(this.gateDetector!);
        this.addChild(this.rightPole!);
    }
}
