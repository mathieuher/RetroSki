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

        let nextGatePosition = TrackBuilder.getNextGatePosition(1);

        for (let index = 0; index < numberOfGates; index++) {
            const gate = new Gate(nextGatePosition, TrackBuilder.getRandomGateWidth(), index % 2 > 0 ? 'red' : 'blue', index + 1);
            gates.push(gate);
            nextGatePosition = TrackBuilder.getNextGatePosition(index + 2, nextGatePosition);
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

    private static getNextGatePosition(gateNumber: number, currentGatePosition?: Vector): Vector {
        if (!currentGatePosition) {
            return vec((Config.GATE_MAX_LEFT_POSITION / 2) + (Math.random() * (Config.GATE_MAX_WIDTH * 0.3)), -Config.GATE_MIN_VERTICAL_DISTANCE);
        } else {
            const isNextLeft = gateNumber % 2 > 0;
            const nextHorizontalDistance = Config.GATE_MIN_HORIZONTAL_DISTANCE + (Math.random() * (Config.GATE_MAX_HORIZONTAL_DISTANCE - Config.GATE_MAX_HORIZONTAL_DISTANCE));
            const nextHorizontalPosition = isNextLeft ? Math.max(Config.GATE_MAX_LEFT_POSITION, currentGatePosition.x - nextHorizontalDistance) : Math.min(Config.GATE_MAX_RIGHT_POSITION, currentGatePosition.x + nextHorizontalDistance);
            const nextVerticalPosition = currentGatePosition.y - (Config.GATE_MIN_VERTICAL_DISTANCE + (Math.random() * (Config.GATE_MAX_VERTICAL_DISTANCE - Config.GATE_MIN_VERTICAL_DISTANCE)));
            return vec(nextHorizontalPosition, nextVerticalPosition);
        }

    }
}