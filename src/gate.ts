import { Actor, Color, Engine, Vector, vec } from "excalibur";
import { Config } from "./config";
import { Pole } from "./pole";
import { GateDetection } from "./gate-detection";

export class Gate extends Actor {

    private leftPole?: Pole;
    private rightPole?: Pole;
    private detectionZone?: GateDetection;
    private gateNumber: number;
    private polesColor: Color;

    constructor(engine: Engine, position: Vector, color: Color, gateNumber: number) {
        super({
            pos: position,
            width: Config.GATE_MIN_WIDTH + (Math.random() * (Config.GATE_MAX_WIDTH - Config.GATE_MIN_WIDTH)),
            height: Config.POLE_HEIGHT,
            anchor: vec(0, 0.5),
        });

        this.polesColor = color;
        this.gateNumber = gateNumber;


    }

    onInitialize() {
        this.on('passed', () => {
            this.children.forEach(child => {
                (child as Actor).color = Color.Green
            });
        })


    }

    update(engine: Engine, delta: number): void {
        if (this.isOnScreen() && !this.children.length) {
            this.buildComponents(engine);
        }

        if (this.pos.y > Config.GATE_DESTROY_CHECKPOINT) {
            this.kill();
        }
    }

    private isOnScreen(): boolean {
        return this.pos.y > -10 && this.pos.y < Config.DISPLAY_HEIGHT;
    }

    private buildComponents(engine: Engine): void {
        this.leftPole = new Pole(engine, vec(0, 0), this.polesColor);
        this.detectionZone = new GateDetection(engine, vec(Config.POLE_WIDTH, 0), this.width - (2 * Config.POLE_WIDTH));
        this.rightPole = new Pole(engine, vec(this.width - Config.POLE_WIDTH, 0), this.polesColor);

        this.addChild(this.leftPole!);
        this.addChild(this.detectionZone!);
        this.addChild(this.rightPole!);
    }
}
