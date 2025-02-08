import { type Vector, vec } from 'excalibur';
import { Config } from '../config';
import { Track } from '../models/track';
import type { StockableTrack } from '../models/stockable-track';
import { TrackStyles } from '../models/track-styles.enum';
import type { GatesConfig } from '../models/gates-config';
import { StockableGate } from '../models/stockable-gate';
import { StockableDecoration } from '../models/stockable-decoration';

export class TrackBuilder {
    /**
     * Design a new track
     * @param name name of the track
     * @param trackStyle style of the track
     * @returns new track
     */
    public static designTrack(name: string, trackStyle: TrackStyles): Track {
        const gatesConfig = TrackBuilder.getGatesConfig(trackStyle);
        const numberOfGates = TrackBuilder.getRandomGatesNumber(gatesConfig);
        const sectorGateNumbers = TrackBuilder.getSectorGateNumbers(numberOfGates);
        console.log('TrackBuilder - Designing a new track of ', numberOfGates, ' gates');

        const gates = TrackBuilder.designGates(trackStyle, gatesConfig, numberOfGates, sectorGateNumbers);
        const decorations = TrackBuilder.designDecorations(gates);

        return new Track(Config.CURRENT_BUILDER_VERSION, undefined, name, trackStyle, new Date(), gates, decorations);
    }

    /**
     * Rebuild an existing track from the storage format
     * @param stockableTrack stockable version of the track
     * @returns the track
     */
    public static buildTrack(stockableTrack: StockableTrack): Track {
        ('TrackBuilder - Rebuilding an existing track');
        return new Track(
            stockableTrack.builderVersion,
            stockableTrack.id,
            stockableTrack.name,
            stockableTrack.style,
            stockableTrack.date,
            stockableTrack.gates,
            stockableTrack.decorations
        );
    }

    public static getGatesConfig(trackStyle: TrackStyles): GatesConfig {
        if (trackStyle === TrackStyles.SL) {
            return Config.SL_GATES_CONFIG;
        }
        if (trackStyle === TrackStyles.GS) {
            return Config.GS_GATES_CONFIG;
        }
        if (trackStyle === TrackStyles.SG) {
            return Config.SG_GATES_CONFIG;
        }
        return Config.DH_GATES_CONFIG;
    }

    private static designGates(
        trackStyle: TrackStyles,
        gatesConfig: GatesConfig,
        numberOfGates: number,
        sectorGateNumbers: number[]
    ): StockableGate[] {
        const gates = [];
        let nextGateWidth = TrackBuilder.getRandomGateWidth(gatesConfig);
        let nextGatePosition = TrackBuilder.getNextGatePosition(nextGateWidth, gatesConfig);

        for (let index = 1; index < numberOfGates; index++) {
            const gate = new StockableGate(
                nextGatePosition.x,
                nextGatePosition.y,
                TrackBuilder.getGateColor(index, trackStyle),
                nextGateWidth,
                index,
                false,
                'none',
                false,
                sectorGateNumbers.indexOf(index) + 1
            );
            gates.push(gate);
            nextGateWidth = TrackBuilder.getRandomGateWidth(gatesConfig);
            nextGatePosition = TrackBuilder.getNextGatePosition(nextGateWidth, gatesConfig, nextGatePosition);
        }

        gates.push(TrackBuilder.generateFinalGate(nextGatePosition.y, numberOfGates + 1));
        return gates;
    }

    private static designDecorations(gates: StockableGate[]): StockableDecoration[] {
        const amount = 50 + Math.floor(Math.random() * (Config.DECORATIONS_AMOUNT_MAX_AMOUNT - 50));
        const firstGatePosition = gates[0].y;
        const distanceAvailable = gates[gates.length - 3].y - firstGatePosition;
        const decorations = [];

        for (let i = 0; i <= amount; i++) {
            let xPosition = Config.DISPLAY_WIDTH / 2;
            const yPosition = Math.floor(Math.random() * distanceAvailable) + firstGatePosition;
            const sizeRatio = 20 + Math.random() * 80;
            const left = Math.random() < 0.5;

            const availableOffset = Math.max(
                0,
                Config.DISPLAY_MIN_MARGIN - (sizeRatio / 100) * Config.DECORATION_TREE_SIZE
            );
            const offset = Math.random() * availableOffset;
            xPosition = left ? -xPosition + offset : xPosition - (Config.DISPLAY_MIN_MARGIN + offset);

            const decoration = new StockableDecoration(xPosition, yPosition, 'tree', sizeRatio);
            decorations.push(decoration);
        }

        decorations.sort((d1, d2) => d2.y - d1.y);
        return decorations;
    }

    private static getRandomGatesNumber(gatesConfig: GatesConfig): number {
        return Math.floor(gatesConfig.minNumber + Math.random() * (gatesConfig.maxNumber - gatesConfig.minNumber));
    }

    private static getGateColor(gateNumber: number, trackStyle: TrackStyles): 'red' | 'blue' {
        if (gateNumber % 2 > 0 || trackStyle === TrackStyles.DH) {
            return 'red';
        }
        return 'blue';
    }

    private static getRandomGateWidth(gatesConfig: GatesConfig): number {
        return gatesConfig.minWidth + Math.random() * (gatesConfig.maxWidth - gatesConfig.minWidth);
    }

    private static generateFinalGate(verticalPosition: number, gateNumber: number): StockableGate {
        return new StockableGate(
            Config.FINAL_GATE_POSITION,
            verticalPosition,
            'red',
            Config.FINAL_GATE_WIDTH,
            gateNumber,
            true,
            'none',
            false,
            Config.SECTORS_PER_RACE + 1
        );
    }

    private static getNextGatePosition(
        gateWidth: number,
        gatesConfig: GatesConfig,
        currentGatePosition?: Vector
    ): Vector {
        const randomizedValue = Math.random();
        const maxRightPosition = Config.GATE_MAX_RIGHT_POSITION - gateWidth;

        if (currentGatePosition) {
            const currentGateSide = TrackBuilder.getGateSide(currentGatePosition);
            const isLeftGate =
                currentGateSide === 'left'
                    ? randomizedValue >= Config.GATE_OTHER_SIDE_PROBABILITY
                    : randomizedValue < Config.GATE_OTHER_SIDE_PROBABILITY;
            const xProjectedPosition = isLeftGate
                ? Config.GATE_MAX_LEFT_POSITION * Math.random()
                : maxRightPosition * Math.random();
            const xDistance = TrackBuilder.getDistance(xProjectedPosition, currentGatePosition.x);
            let xRestrictedPosition: number;
            if (xDistance > gatesConfig.maxHorizontalDistance) {
                xRestrictedPosition = TrackBuilder.furtherAutorizedXPosition(
                    currentGatePosition.x,
                    isLeftGate ? 'left' : 'right',
                    maxRightPosition,
                    gatesConfig
                );
            } else {
                xRestrictedPosition = xProjectedPosition;
            }
            const yPosition =
                currentGatePosition.y -
                (gatesConfig.minVerticalDistance +
                    Math.random() * (gatesConfig.maxVerticalDistance - gatesConfig.minVerticalDistance));
            return vec(xRestrictedPosition, yPosition);
        }

        const isLeftGate = randomizedValue > 0.5;
        const xPosition = maxRightPosition * Math.random();
        return vec(
            isLeftGate ? -xPosition : xPosition,
            -((gatesConfig.maxVerticalDistance + gatesConfig.minVerticalDistance) / 2)
        );
    }

    private static getSectorGateNumbers(gatesNumber: number): number[] {
        const numbers: number[] = [];
        const firstGateNumber = Math.floor(gatesNumber / (Config.SECTORS_PER_RACE + 1));
        for (let i = 1; i <= Config.SECTORS_PER_RACE; i++) {
            numbers.push(firstGateNumber * i);
        }
        return numbers;
    }

    private static furtherAutorizedXPosition(
        reference: number,
        direction: 'left' | 'right',
        maxRightPosition: number,
        gatesConfig: GatesConfig
    ): number {
        if (direction === 'left') {
            return Math.max(reference - gatesConfig.maxHorizontalDistance, Config.GATE_MAX_LEFT_POSITION);
        }
        return Math.min(reference + gatesConfig.maxHorizontalDistance, maxRightPosition);
    }

    private static getDistance(x1: number, x2: number): number {
        if (x1 >= 0 && x2 >= 0) {
            return Math.abs(x1 - x2);
        }
        if (x1 >= 0 && x2 < 0) {
            return x1 - x2;
        }
        return Math.abs(x2 - x1);
    }

    private static getGateSide(gatePosition: Vector): 'left' | 'right' | 'middle' {
        const middlePosition = 0;
        if (gatePosition.x < middlePosition) {
            return 'left';
        }
        if (gatePosition.x > middlePosition) {
            return 'right';
        }
        return 'middle';
    }
}
