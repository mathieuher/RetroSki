import { Actor, Color, GraphicsGroup, Line, type Vector, toRadians, vec } from 'excalibur';
import { Config } from '../config';
import { Pole } from './pole';
import { GateDetector } from './gate-detector';
import type { Race } from '../scenes/race';
import { type Pivot, StockableGate } from '../models/stockable-gate';
import { Resources } from '../resources';
import type { GatesConfig } from '../models/gates-config';
import { ScreenManager } from '../utils/screen-manager';
import type { Game, GameMode } from '../game';
import type { Settings } from '../../common/models/settings';
import type { Academy } from '../scenes/academy';

export class Gate extends Actor {
    public config: GatesConfig;
    public isFinalGate!: boolean;
    public sectorNumber?: number;
    public missed = false;

    private engine: Game;
    private leftPole?: Pole;
    private rightPole?: Pole;
    private gateDetector?: GateDetector;
    private sectorLine?: Actor;
    private gateNumber: number;
    private polesColor: 'red' | 'blue';
    private straddled = false;
    private passed = false;
    private gateProcessed = false;
    private polesAmount: number;
    private pivot: Pivot;
    private vertical: boolean;

    constructor(
        engine: Game,
        config: GatesConfig,
        position: Vector,
        width: number,
        color: 'red' | 'blue',
        gateNumber: number,
        polesAmount: number,
        pivot: Pivot,
        vertical: boolean,
        isFinalGate = false,
        sectorNumber?: number
    ) {
        super({
            pos: position,
            width: vertical ? config.poleWidth : width,
            height: vertical ? width : Config.GATE_DEFAULT_HEIGHT,
            anchor: Gate.getAnchor(vertical, pivot),
            z: isFinalGate ? 5 : 1
        });
        this.engine = engine;
        this.config = config;
        this.isFinalGate = isFinalGate;
        this.sectorNumber = sectorNumber;
        this.polesColor = color;
        this.gateNumber = gateNumber;
        this.polesAmount = polesAmount;
        this.pivot = pivot;
        this.vertical = vertical;

        if (this.isFinalGate) {
            const graphics = new GraphicsGroup({
                members: [
                    {
                        graphic: Resources.FinalGateShadow.toSprite(),
                        offset: vec(0, -Config.FINAL_POLE_HEIGHT),
                        useBounds: false
                    },
                    {
                        graphic: Resources.FinalGate.toSprite(),
                        offset: vec(0, -Config.FINAL_POLE_HEIGHT),
                        useBounds: false
                    }
                ]
            });
            this.graphics.use(graphics);
        }

        // Show optionnal side indicator
        if (this.shouldDisplaySideIndicators(this.engine.mode, this.engine.settingsService.getSettings())) {
            this.displaySideIndicators();
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

        if (!this.gateProcessed && this.shouldBePassed()) {
            this.gateProcessed = true;

            if (this.passed && !this.straddled) {
                this.updatePassedPolesGraphics();
                this.engine.customEvents.emit({ name: 'gate-event', content: 'passed' });
            } else {
                (this.scene as Race).addPenalty();
                this.missed = true;
                this.engine.customEvents.emit({ name: 'gate-event', content: 'missed' });
            }

            if (this.sectorNumber && this.engine.mode === 'race') {
                (this.scene as Race).setSector(this.sectorNumber);
            }

            if (this.isFinalGate) {
                (this.scene as Race | Academy).stop();
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
            this.polesAmount,
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
        return ScreenManager.isBehind(this.scene!.camera.pos.y, this.pos.y - this.height);
    }

    private buildComponents(): void {
        const gatePoleWidth = this.isFinalGate ? Config.FINAL_POLE_WIDTH : this.config.poleWidth;

        if (!this.isFinalGate) {
            this.buildPoles(this.width, gatePoleWidth, this.pivot, this.vertical);
        }

        this.buildGateDetector(
            this.width,
            this.height,
            gatePoleWidth,
            this.config.poleHeight,
            this.vertical,
            this.pivot,
            this.isFinalGate
        );

        if (this.sectorNumber) {
            this.buildSectorLine(this.vertical, this.pivot, gatePoleWidth);
        }
    }

    private onGatePassed(): void {
        this.passed = true;
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

    private buildGateDetector(
        gateWidth: number,
        gateHeight: number,
        poleWidth: number,
        poleHeight: number,
        vertical: boolean,
        pivot: Pivot,
        isFinal: boolean
    ): void {
        let detectorVisibility = false;
        let adjustedGateWidth = gateWidth;

        if ((this.engine as Game).customSetup?.useOptimizedTrajectoryDetector) {
            detectorVisibility = true;
            adjustedGateWidth = pivot !== 'none' && !vertical && !isFinal ? gateWidth * 0.6 : gateWidth;
        }

        if (vertical) {
            this.gateDetector = new GateDetector(
                vec(0, -poleHeight),
                adjustedGateWidth,
                gateHeight - poleHeight,
                detectorVisibility
            );
        } else {
            const detectorSize = adjustedGateWidth - 2 * (poleWidth + Config.POLE_DETECTOR_MARGIN);
            let detectorStartPosition: Vector;

            if (pivot === 'left') {
                detectorStartPosition = vec(poleWidth + Config.POLE_DETECTOR_MARGIN, 0);
            } else if (pivot === 'right') {
                detectorStartPosition = vec(poleWidth + Config.POLE_DETECTOR_MARGIN - adjustedGateWidth, 0);
            } else {
                detectorStartPosition = vec(poleWidth + Config.POLE_DETECTOR_MARGIN - adjustedGateWidth / 2, 0);
            }

            this.gateDetector = new GateDetector(detectorStartPosition, detectorSize, gateHeight, detectorVisibility);
        }
        this.addChild(this.gateDetector);
    }

    private buildSectorLine(vertical: boolean, pivot: Pivot, poleWidth: number): void {
        this.sectorLine = new Actor({ anchor: vec(vertical ? -0.5 : 0, 0), z: 0 });
        let start: Vector;
        let end: Vector;

        if (vertical) {
            start = vec(0, 0);
            end = vec(0, -this.height);
        } else if (pivot === 'left') {
            start = vec(poleWidth, 0);
            end = vec(this.width - poleWidth, 0);
        } else if (pivot === 'right') {
            start = vec(poleWidth - this.width, 0);
            end = vec(-poleWidth, 0);
        } else {
            start = vec(this.width / 2 - poleWidth, 0);
            end = vec(poleWidth - this.width / 2, 0);
        }

        this.sectorLine.graphics.use(
            new Line({
                start: start,
                end: end,
                color: Color.LightGray,
                thickness: 3.5
            })
        );
        this.sectorLine.graphics.opacity = 0.3;
        this.addChild(this.sectorLine);
    }

    private buildPoles(gateWidth: number, poleWidth: number, pivot: Pivot, vertical: boolean): void {
        if (vertical) {
            this.leftPole = new Pole(vec(0, 0), this.polesColor, this.config, this.isFinalGate);
            this.rightPole = new Pole(vec(0, -this.height), this.polesColor, this.config, this.isFinalGate);
        } else if (pivot === 'left') {
            this.leftPole = new Pole(vec(0, 0), this.polesColor, this.config, this.isFinalGate);
            if (this.polesAmount === 2) {
                this.rightPole = new Pole(
                    vec(gateWidth - poleWidth, 0),
                    this.polesColor,
                    this.config,
                    this.isFinalGate
                );
            }
        } else if (this.pivot === 'right') {
            this.rightPole = new Pole(vec(-poleWidth, 0), this.polesColor, this.config, this.isFinalGate);
            if (this.polesAmount === 2) {
                this.leftPole = new Pole(vec(-gateWidth, 0), this.polesColor, this.config, this.isFinalGate);
            }
        } else {
            this.leftPole = new Pole(vec(-gateWidth / 2, 0), this.polesColor, this.config, this.isFinalGate);
            this.rightPole = new Pole(
                vec(gateWidth / 2 - poleWidth, 0),
                this.polesColor,
                this.config,
                this.isFinalGate
            );
        }

        if (this.leftPole) {
            this.addChild(this.leftPole);
        }

        if (this.rightPole) {
            this.addChild(this.rightPole);
        }
    }

    private static getAnchor(vertical: boolean, pivot: Pivot): Vector {
        if (vertical) {
            return vec(0, 1);
        }
        if (pivot === 'left') {
            return vec(0, 1);
        }
        if (pivot === 'right') {
            return vec(1, 1);
        }
        return vec(0.5, 1);
    }

    private shouldDisplaySideIndicators(mode: GameMode, settings: Settings): boolean {
        return (this.polesAmount === 1 || this.vertical) && (settings?.sideIndicators || mode === 'academy');
    }

    private displaySideIndicators(): void {
        const xOffset = this.pivot === 'left' ? 15 : -30;
        const sprite =
            this.polesColor === 'blue' ? Resources.PoleArrowBlue.toSprite() : Resources.PoleArrowRed.toSprite();
        sprite.flipHorizontal = this.pivot === 'left';

        const graphics = new GraphicsGroup({
            members: [
                {
                    graphic: sprite,
                    offset: vec(xOffset, -15),
                    useBounds: false
                }
            ],
            useAnchor: false,
            opacity: 0.4
        });
        this.graphics.use(graphics);
    }
}
