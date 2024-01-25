import { Vector, vec } from "excalibur";
import { Gate } from "../actors/gate";
import { Config } from "../config";
import { Track } from "../models/track";
import { StockableTrack } from "../models/stockable-track";
import { TrackStyles } from "../models/track-styles.enum";
import { GatesConfig } from "../models/gates-config";

export class TrackBuilder {

    /**
     * Design a new track
     * @param name name of the track
     * @param trackStyle style of the track
     * @returns new track
     */
    public static designTrack(name: string, trackStyle: TrackStyles): Track {
        const gates = [];
        const gatesConfig = TrackBuilder.getGatesConfig(trackStyle);
        const numberOfGates = this.getRandomGatesNumber(gatesConfig);
        const sectorGateNumbers = this.getSectorGateNumbers(numberOfGates);
        console.log('TrackBuilder - Designing a new track of ', numberOfGates, ' gates');

        let nextGateWidth = TrackBuilder.getRandomGateWidth(gatesConfig);
        let nextGatePosition = TrackBuilder.getNextGatePosition(nextGateWidth, gatesConfig);

        for (let index = 1; index < numberOfGates; index++) {
            const gate = new Gate(nextGatePosition, nextGateWidth, index % 2 > 0 ? 'red' : 'blue', index, false, sectorGateNumbers.indexOf(index) + 1);
            gates.push(gate);
            nextGateWidth = TrackBuilder.getRandomGateWidth(gatesConfig);
            nextGatePosition = TrackBuilder.getNextGatePosition(nextGateWidth, gatesConfig, nextGatePosition);
        }

        gates.push(TrackBuilder.generateFinalGate(nextGatePosition.y, numberOfGates + 1));

        return new Track(Config.CURRENT_BUILDER_VERSION, name, trackStyle, new Date(), gates, []);
    }

    /**
     * Rebuild an existing track from the storage format
     * @param stockableTrack stockable version of the track
     * @returns the track
     */
    public static buildTrack(stockableTrack: StockableTrack): Track {
        console.log('TrackBuilder - Rebuilding an existing track');
        const gates: Gate[] = [];
        stockableTrack.gates.forEach(stockableGate => {
            gates.push(new Gate(vec(stockableGate.x, stockableGate.y), stockableGate.width, stockableGate.color, stockableGate.gateNumber, stockableGate.isFinal, stockableGate.sectorNumber));
        });
        return new Track(stockableTrack.builderVersion, stockableTrack.name, stockableTrack.style, stockableTrack.date, gates, stockableTrack.records);
    }

    private static getRandomGatesNumber(gatesConfig: GatesConfig): number {
        return Math.floor(gatesConfig.minNumber + (Math.random() * (gatesConfig.maxNumber - gatesConfig.minNumber)));
    }

    private static getRandomGateWidth(gatesConfig: GatesConfig): number {
        return gatesConfig.minWidth + (Math.random() * (gatesConfig.maxWidth - gatesConfig.minWidth));
    }

    private static generateFinalGate(verticalPosition: number, gateNumber: number): Gate {
        return new Gate(vec(Config.FINAL_GATE_POSITION, verticalPosition), Config.FINAL_GATE_WIDTH, 'red', gateNumber, true, Config.SECTORS_PER_RACE + 1);
    }

    private static getNextGatePosition(gateWidth: number, gatesConfig: GatesConfig, currentGatePosition?: Vector): Vector {
        const randomizedValue = Math.random();
        const maxRightPosition = Config.GATE_MAX_RIGHT_POSITION - gateWidth;
        if (!currentGatePosition) {
            const isLeftGate = randomizedValue > 0.5;
            const xPosition = maxRightPosition * Math.random();
            return vec(isLeftGate ? -xPosition : xPosition, -((gatesConfig.maxVerticalDistance + gatesConfig.minVerticalDistance) / 2));
        } else {
            const currentGateSide = this.getGateSide(currentGatePosition);
            const isLeftGate = currentGateSide === 'left' ? randomizedValue >= Config.GATE_OTHER_SIDE_PROBABILITY : randomizedValue < Config.GATE_OTHER_SIDE_PROBABILITY;
            const xProjectedPosition = isLeftGate ? Config.GATE_MAX_LEFT_POSITION * Math.random() : maxRightPosition * Math.random();
            const xDistance = TrackBuilder.getDistance(xProjectedPosition, currentGatePosition.x);
            let xRestrictedPosition: number;
            if (xDistance > gatesConfig.maxHorizontalDistance) {
                xRestrictedPosition = TrackBuilder.furtherAutorizedXPosition(currentGatePosition.x, isLeftGate ? 'left' : 'right', maxRightPosition, gatesConfig);
            } else {
                xRestrictedPosition = xProjectedPosition;
            }
            const yPosition = currentGatePosition.y - (gatesConfig.minVerticalDistance + (Math.random() * (gatesConfig.maxVerticalDistance - gatesConfig.minVerticalDistance)));
            return vec(xRestrictedPosition, yPosition);
        }
    }

    private static getSectorGateNumbers(gatesNumber: number): number[] {
        const numbers: number[] = [];
        const firstGateNumber = Math.floor(gatesNumber / (Config.SECTORS_PER_RACE + 1));
        for (let i = 1; i <= Config.SECTORS_PER_RACE; i++) {
            numbers.push(firstGateNumber * i);
        }
        return numbers;
    }

    private static getGatesConfig(trackStyle: TrackStyles): GatesConfig {
        if (trackStyle === TrackStyles.SL) {
            return Config.SL_GATES_CONFIG;
        } else if (trackStyle === TrackStyles.GS) {
            return Config.GS_GATES_CONFIG;
        } else if (trackStyle === TrackStyles.SG) {
            return Config.SG_GATES_CONFIG;
        } else {
            return Config.DH_GATES_CONFIG;
        }
    }

    private static furtherAutorizedXPosition(reference: number, direction: 'left' | 'right', maxRightPosition: number, gatesConfig: GatesConfig): number {
        if (direction === 'left') {
            return Math.max(reference - gatesConfig.maxHorizontalDistance, Config.GATE_MAX_LEFT_POSITION);
        } else {
            return Math.min(reference + gatesConfig.maxHorizontalDistance, maxRightPosition);
        }
    }

    private static getDistance(x1: number, x2: number): number {
        if (x1 >= 0 && x2 >= 0) {
            return Math.abs(x1 - x2);
        } else if (x1 >= 0 && x2 < 0) {
            return x1 - x2;
        } else {
            return Math.abs(x2 - x1);
        }
    }

    private static getGateSide(gatePosition: Vector): 'left' | 'right' | 'middle' {
        const middlePosition = 0;
        if (gatePosition.x < middlePosition) {
            return 'left';
        } else if (gatePosition.x > middlePosition) {
            return 'right';
        } else {
            return 'middle';
        }
    }
}