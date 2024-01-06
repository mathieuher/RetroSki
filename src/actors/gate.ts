import { Actor, Vector, vec } from "excalibur";
import { Config } from "../config";
import { Pole } from "./pole";
import { GateDetector } from "./gate-detector";
import { Race } from "../scenes/race";
import { StockableGate } from "../models/stockable-gate";
import { Resources } from "../resources";

export class Gate extends Actor {

    public isFinalGate!: boolean
    private leftPole?: Pole;
    private rightPole?: Pole;
    private gateDetector?: GateDetector;
    private gateNumber?: number;
    private polesColor: 'red' | 'blue';
    private gatePassed = false;

    constructor(position: Vector, width: number, color: 'red' | 'blue', gateNumber?: number, isFinalGate = false) {
        super({
            pos: position,
            width: width,
            height: isFinalGate ? Config.FINAL_POLE_HEIGHT : Config.POLE_HEIGHT,
            anchor: vec(0, 0.5)
        });

        this.isFinalGate = isFinalGate;
        this.polesColor = color;
        this.gateNumber = gateNumber;
    }

    onInitialize() {
        this.on('passed', () => {
            this.gatePassed = true;
            if (this.isFinalGate) {
                (this.scene as Race).stopRace();
            } else {
                this.children.forEach(child => {
                    const sprite = this.polesColor === 'red' ? Resources.PolePassedRed.toSprite() : Resources.PolePassedBlue.toSprite();
                    if (child instanceof Pole) {
                        child.graphics.use(sprite);
                    }
                });
            }
        })


    }

    update(): void {
        if (this.isOnScreen() && !this.children.length) {
            this.buildComponents();
        }

        if (this.canBeDestroy()) {
            if (!this.gatePassed && !this.isFinalGate) {
                (this.scene as Race).addPenalty();
            }
            this.kill();
        }
    }

    public getStockableGate(): StockableGate {
        return {
            x: this.pos.x,
            y: this.pos.y,
            color: this.polesColor,
            width: this.width,
            gateNumber: this.gateNumber,
            isFinal: this.isFinalGate
        };
    }

    private isOnScreen(): boolean {
        return Math.abs(this.scene.camera.y - this.pos.y) < Config.DISPLAY_HEIGHT;
    }

    private canBeDestroy(): boolean {
        return this.scene.camera.y - this.pos.y < - Config.DISPLAY_HEIGHT;
    }

    private buildComponents(): void {
        const gatePoleWidth = (this.isFinalGate ? Config.FINAL_POLE_WIDTH : Config.POLE_WIDTH);

        this.leftPole = new Pole(vec(0, 0), this.polesColor, this.isFinalGate);
        this.gateDetector = new GateDetector(vec(gatePoleWidth + Config.POLE_DETECTOR_MARGIN, 0), this.width - (2 * (gatePoleWidth + Config.POLE_DETECTOR_MARGIN)), this.isFinalGate);
        this.rightPole = new Pole(vec(this.width - gatePoleWidth, 0), this.polesColor, this.isFinalGate);

        this.addChild(this.leftPole!);
        this.addChild(this.gateDetector!);
        this.addChild(this.rightPole!);
    }
}
