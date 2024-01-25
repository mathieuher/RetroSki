import { Actor, Vector, vec } from "excalibur";
import { Config } from "../config";
import { Pole } from "./pole";
import { GateDetector } from "./gate-detector";
import { Race } from "../scenes/race";
import { StockableGate } from "../models/stockable-gate";
import { Resources } from "../resources";

export class Gate extends Actor {

    public isFinalGate!: boolean;
    public sectorNumber?: number;
    public passed = false;

    private leftPole?: Pole;
    private rightPole?: Pole;
    private gateDetector?: GateDetector;
    private gateNumber: number;
    private polesColor: 'red' | 'blue';
    private missed = false;


    constructor(position: Vector, width: number, color: 'red' | 'blue', gateNumber: number, isFinalGate = false, sectorNumber?: number) {
        super({
            pos: position,
            width: width,
            height: isFinalGate ? Config.FINAL_POLE_HEIGHT : Config.POLE_HEIGHT,
            anchor: vec(0, 0.5)
        });

        this.isFinalGate = isFinalGate;
        this.sectorNumber = sectorNumber;
        this.polesColor = color;
        this.gateNumber = gateNumber;
    }

    onInitialize() {
        this.on('passed', () => this.onGatePassed());
    }

    update(): void {
        if (this.isOnScreen() && !this.children.length) {
            this.buildComponents();
        }

        if (!this.isFinalGate && !this.passed && !this.missed && this.shouldBePassed()) {
            (this.scene as Race).addPenalty();
            this.missed = true;
        }

        if (this.canBeDestroy()) {
            this.kill();
        }
    }

    public getStockableGate(): StockableGate {
        return new StockableGate(this.pos.x, this.pos.y, this.polesColor, this.width, this.gateNumber, this.isFinalGate, this.sectorNumber);
    }

    private isOnScreen(): boolean {
        return Math.abs(this.scene.camera.y - this.pos.y) < Config.DISPLAY_HEIGHT * Config.VISIBLE_ON_SCREEN_MARGIN_FACTOR;
    }

    private shouldBePassed(): boolean {
        if ((this.scene as Race).skier?.racing && this.pos.y + Config.FRONT_GHOST_DISTANCE > this.scene.camera.pos.y) {
            return true;
        } else {
            return false;
        }
    }

    private canBeDestroy(): boolean {
        return this.scene.camera.y - this.pos.y < - Config.DISPLAY_HEIGHT * Config.VISIBLE_ON_SCREEN_MARGIN_FACTOR;
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

    private onGatePassed(): void {
        this.passed = true;
        if (this.sectorNumber) {
            (this.scene as Race).setSector(this.sectorNumber);
        }
        if (this.isFinalGate) {
            (this.scene as Race).stopRace();
        } else {
            this.updatePassedPolesGraphics();
        }
    }

    private updatePassedPolesGraphics(): void {
        this.children.forEach(child => {
            const sprite = this.polesColor === 'red' ? Resources.PolePassedRed.toSprite() : Resources.PolePassedBlue.toSprite();
            if (child instanceof Pole) {
                child.graphics.use(sprite);
            }
        });
    }
}
