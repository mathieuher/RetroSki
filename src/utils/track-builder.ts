import { Vector, vec } from "excalibur";
import { Gate } from "../actors/gate";
import { Config } from "../config";
import { Track } from "../models/track";
import { StockableTrack } from "../models/stockable-track";

export class TrackBuilder {

    public static designTrack(name: string): Track {
        const gates = [];
        const numberOfGates = Math.floor(Config.GATE_MIN_NUMBER + (Math.random() * (Config.GATE_MAX_NUMBER - Config.GATE_MIN_NUMBER)));
        console.log('TrackBuilder - Designing a new track of ', numberOfGates, ' gates');

        let nextGateWidth = TrackBuilder.getRandomGateWidth();
        let nextGatePosition = TrackBuilder.getNextGatePosition(nextGateWidth);

        for (let index = 0; index < numberOfGates; index++) {
            const gate = new Gate(nextGatePosition, nextGateWidth, index % 2 > 0 ? 'red' : 'blue', index + 1);
            gates.push(gate);
            nextGateWidth = TrackBuilder.getRandomGateWidth();
            nextGatePosition = TrackBuilder.getNextGatePosition(nextGateWidth, nextGatePosition);
        }

        gates.push(TrackBuilder.generateFinalGate(nextGatePosition.y));

        return new Track(name, new Date(), gates, []);
    }

    public static buildTrack(stockableTrack: StockableTrack): Track {
        console.log('building from an existing track');
        const gates: Gate[] = [];
        stockableTrack.gates.forEach(stockableGate => {
            gates.push(new Gate(vec(stockableGate.x, stockableGate.y), stockableGate.width, stockableGate.color, stockableGate.gateNumber, stockableGate.isFinal));
        });
        return new Track(stockableTrack.name, stockableTrack.date, gates, stockableTrack.records);
    }

    private static getRandomGateWidth(): number {
        return Config.GATE_MIN_WIDTH + (Math.random() * (Config.GATE_MAX_WIDTH - Config.GATE_MIN_WIDTH));
    }

    private static generateFinalGate(verticalPosition: number): Gate {
        return new Gate(vec(Config.FINAL_GATE_POSITION, verticalPosition), Config.FINAL_GATE_WIDTH, 'red', undefined, true);
    }

    private static getNextGatePosition(gateWidth: number, currentGatePosition?: Vector): Vector {
        const randomizedValue = Math.random();
        const maxRightPosition = Config.GATE_MAX_RIGHT_POSITION - gateWidth;
        if (!currentGatePosition) {
            // TODO : Randomly positioning first gate
            const isLeftGate = randomizedValue > 0.5;
            const xPosition = maxRightPosition * Math.random();
            return vec(isLeftGate ? -xPosition : xPosition, -Config.GATE_MAX_VERTICAL_DISTANCE);
        } else {
            const currentGateSide = this.getGateSide(currentGatePosition);
            // TODO : Randomly positioning gate favorising the other side of the track
            const isLeftGate = currentGateSide === 'left' ? randomizedValue >= Config.GATE_OTHER_SIDE_PROBABILITY : randomizedValue < Config.GATE_OTHER_SIDE_PROBABILITY;
            const xProjectedPosition = isLeftGate ? Config.GATE_MAX_LEFT_POSITION * Math.random() : maxRightPosition * Math.random();
            const xDistance = TrackBuilder.getDistance(xProjectedPosition, currentGatePosition.x);
            let xRestrictedPosition: number;
            if (xDistance > Config.GATE_MAX_HORIZONTAL_DISTANCE) {
                xRestrictedPosition = TrackBuilder.furtherAutorizedXPosition(currentGatePosition.x, isLeftGate ? 'left' : 'right', maxRightPosition);
            } else {
                xRestrictedPosition = xProjectedPosition;
            }
            const yPosition = currentGatePosition.y - (Config.GATE_MIN_VERTICAL_DISTANCE + (Math.random() * (Config.GATE_MAX_VERTICAL_DISTANCE - Config.GATE_MIN_VERTICAL_DISTANCE)));
            return vec(xRestrictedPosition, yPosition);
        }
    }

    private static furtherAutorizedXPosition(reference: number, direction: 'left' | 'right', maxRightPosition: number): number {
        if (direction === 'left') {
            return Math.max(reference - Config.GATE_MAX_HORIZONTAL_DISTANCE, Config.GATE_MAX_LEFT_POSITION);
        } else {
            return Math.min(reference + Config.GATE_MAX_HORIZONTAL_DISTANCE, maxRightPosition);
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