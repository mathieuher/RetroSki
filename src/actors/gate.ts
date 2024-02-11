import { Actor, Color, Line, Vector, vec } from 'excalibur';
import { Config } from '../config';
import { Pole } from './pole';
import { GateDetector } from './gate-detector';
import { Race } from '../scenes/race';
import { StockableGate } from '../models/stockable-gate';
import { Resources } from '../resources';
import { GatesConfig } from '../models/gates-config';

export class Gate extends Actor {
    public config: GatesConfig;
    public isFinalGate!: boolean;
    public sectorNumber?: number;
    public passed = false;

    private leftPole?: Pole;
    private rightPole?: Pole;
    private gateDetector?: GateDetector;
    private sectorLine?: Actor;
    private gateNumber: number;
    private polesColor: 'red' | 'blue';
    private missed = false;

    constructor(
        config: GatesConfig,
        position: Vector,
        width: number,
        color: 'red' | 'blue',
        gateNumber: number,
        isFinalGate = false,
        sectorNumber?: number,
    ) {
        super({
            pos: position,
            width: width,
            height: isFinalGate ? Config.FINAL_POLE_HEIGHT : config.poleHeight,
            anchor: vec(0, 0.5),
            z: 5
        });

        this.config = config;
        this.isFinalGate = isFinalGate;
        this.sectorNumber = sectorNumber;
        this.polesColor = color;
        this.gateNumber = gateNumber;

        if (this.isFinalGate) {
            this.graphics.use(Resources.FinalGate.toSprite());
        }
    }

    onInitialize() {
        this.on('passed', () => this.onGatePassed());
    }

    update(): void {
        if (this.isOnScreen() && !this.children.length) {
            this.buildComponents();
        }

        if (!this.passed && !this.missed && this.shouldBePassed()) {
            (this.scene as Race).addPenalty();
            this.missed = true;

            if (this.sectorNumber) {
                (this.scene as Race).setSector(this.sectorNumber);
            }

            if (this.isFinalGate) {
                (this.scene as Race).stopRace();
            }
        }

        if (this.canBeDestroy()) {
            this.kill();
        }
    }

    public getStockableGate(): StockableGate {
        return new StockableGate(
            this.pos.x,
            this.pos.y,
            this.polesColor,
            this.width,
            this.gateNumber,
            this.isFinalGate,
            this.sectorNumber,
        );
    }

    private isOnScreen(): boolean {
        return (
            Math.abs(this.scene.camera.y - this.pos.y) <
            Config.DISPLAY_HEIGHT * Config.VISIBLE_ON_SCREEN_MARGIN_FACTOR
        );
    }

    private shouldBePassed(): boolean {
        if (
            (this.scene as Race).skier?.racing &&
            this.pos.y + Config.FRONT_GHOST_DISTANCE > this.scene.camera.pos.y
        ) {
            return true;
        }
        return false;
    }

    private canBeDestroy(): boolean {
        return (
            this.scene.camera.y - this.pos.y < -Config.DISPLAY_HEIGHT * Config.VISIBLE_ON_SCREEN_MARGIN_FACTOR
        );
    }

    private buildComponents(): void {
        const gatePoleWidth = this.isFinalGate ? Config.FINAL_POLE_WIDTH : this.config.poleWidth;
        const gatePoleHeight = this.isFinalGate ? Config.FINAL_POLE_HEIGHT : this.config.poleHeight;

        this.leftPole = new Pole(vec(0, 0), this.polesColor, this.config, this.isFinalGate);
        this.gateDetector = new GateDetector(
            vec(gatePoleWidth + Config.POLE_DETECTOR_MARGIN, 0),
            this.width - 2 * (gatePoleWidth + Config.POLE_DETECTOR_MARGIN),
            this.isFinalGate ? gatePoleHeight : gatePoleHeight / 2,
            this.isFinalGate,
        );
        this.rightPole = new Pole(vec(this.width - gatePoleWidth, 0), this.polesColor, this.config, this.isFinalGate);

        this.addChild(this.leftPole!);
        this.addChild(this.gateDetector!);
        this.addChild(this.rightPole!);

        if (this.sectorNumber) {
            this.sectorLine = new Actor({ anchor: vec(0, 0), z: 0 });
            this.sectorLine.graphics.use(
                new Line({
                    start: vec(gatePoleWidth - 5, gatePoleHeight / 2),
                    end: vec(this.width - gatePoleWidth + 5, gatePoleHeight / 2),
                    color: Color.Red,
                    thickness: 3.5
                }),
            );
            this.sectorLine.graphics.opacity = 0.3;
            this.addChild(this.sectorLine);
        }
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
        for (const child of this.children) {
            if (child instanceof Pole) {
                child.displayPoleCheck();
            }
        }
    }
}
