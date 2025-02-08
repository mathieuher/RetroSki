import { Actor, Color, GraphicsGroup, Line, type Vector, vec } from 'excalibur';
import { Config } from '../config';
import { Pole } from './pole';
import { GateDetector } from './gate-detector';
import type { Race } from '../scenes/race';
import { type Pivot, StockableGate } from '../models/stockable-gate';
import { Resources } from '../resources';
import type { GatesConfig } from '../models/gates-config';
import { ScreenManager } from '../utils/screen-manager';

export class Gate extends Actor {
    public config: GatesConfig;
    public isFinalGate!: boolean;
    public sectorNumber?: number;
    public passed = false;

    private builderVersion: number;
    private leftPole?: Pole;
    private rightPole?: Pole;
    private gateDetector?: GateDetector;
    private sectorLine?: Actor;
    private gateNumber: number;
    private polesColor: 'red' | 'blue';
    private missed = false;
    private straddled = false;

    private pivot: Pivot;
    private vertical: boolean;

    constructor(
        config: GatesConfig,
        builderVersion: number,
        position: Vector,
        width: number,
        color: 'red' | 'blue',
        gateNumber: number,
        pivot: Pivot,
        vertical: boolean,
        isFinalGate = false,
        sectorNumber?: number
    ) {
        super({
            pos: position,
            width: width,
            height: Config.GATE_DEFAULT_HEIGHT,
            anchor: vec(0, 1),
            z: 5
        });

        this.config = config;
        this.builderVersion = builderVersion;
        this.isFinalGate = isFinalGate;
        this.sectorNumber = sectorNumber;
        this.polesColor = color;
        this.gateNumber = gateNumber;
        this.pivot = pivot;
        this.vertical = vertical;

        if (this.isFinalGate) {
            const graphics = new GraphicsGroup({
                members: [
                    {
                        graphic: Resources.FinalGateShadow.toSprite(),
                        offset: vec(0, 0),
                        useBounds: false
                    },
                    {
                        graphic: Resources.FinalGate.toSprite(),
                        offset: vec(0, 0)
                    }
                ]
            });
            this.graphics.use(graphics);
        }

        this.on('straddled', () => this.onGateStraddled());
        this.on('passed', () => this.onGatePassed());
        this.on('exitviewport', () => {
            if (this.isBehind()) {
                this.kill();
            }
        });
    }

    override update(): void {
        if (!this.children?.length && ScreenManager.isNearScreen(this, this.scene!.camera)) {
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
    }

    public getStockableGate(): StockableGate {
        return new StockableGate(
            this.pos.x,
            this.pos.y,
            this.polesColor,
            this.width,
            this.gateNumber,
            this.isFinalGate,
            this.pivot,
            this.vertical,
            this.sectorNumber
        );
    }

    private shouldBePassed(): boolean {
        if ((this.scene as Race).skier?.racing && this.isBehind()) {
            return true;
        }
        return false;
    }

    private isBehind(): boolean {
        return ScreenManager.isBehind(this.scene!.camera.pos, this.pos);
    }

    private buildComponents(): void {
        const gatePoleWidth = this.isFinalGate ? Config.FINAL_POLE_WIDTH : this.config.poleWidth;
        const gatePoleHeight = this.isFinalGate ? Config.FINAL_POLE_HEIGHT : this.config.poleHeight;

        this.gateDetector = new GateDetector(
            vec(gatePoleWidth + Config.POLE_DETECTOR_MARGIN, 0),
            this.width - 2 * (gatePoleWidth + Config.POLE_DETECTOR_MARGIN),
            this.height / 2
        );

        if (!this.isFinalGate) {
            this.leftPole = new Pole(vec(0, 0), this.polesColor, this.config, this.isFinalGate);
            this.rightPole = new Pole(
                vec(this.width - gatePoleWidth, 0),
                this.polesColor,
                this.config,
                this.isFinalGate
            );
            this.addChild(this.leftPole!);
            this.addChild(this.rightPole!);
        }

        this.addChild(this.gateDetector!);

        if (this.sectorNumber) {
            this.sectorLine = new Actor({ anchor: vec(0, 0), z: 0 });
            this.sectorLine.graphics.use(
                new Line({
                    start: vec(gatePoleWidth, 0),
                    end: vec(this.width - gatePoleWidth, 0),
                    color: Color.Red,
                    thickness: 3.5
                })
            );
            this.sectorLine.graphics.opacity = 0.3;
            this.addChild(this.sectorLine);
        }
    }

    private onGatePassed(): void {
        setTimeout(() => {
            if (!this.straddled) {
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
        }, 30);
    }

    private onGateStraddled(): void {
        this.straddled = true;
    }

    private updatePassedPolesGraphics(): void {
        for (const child of this.children) {
            if (child instanceof Pole) {
                child.displayPoleCheck();
            }
        }
    }
}
