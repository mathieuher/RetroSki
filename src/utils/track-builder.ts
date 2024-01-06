import { Color, Vector, vec } from "excalibur";
import { Gate } from "../actors/gate";
import { Config } from "../config";

export class TrackBuilder {

    public static buildTrack(): Gate[] {
        const gates = [];
        const numberOfGates = Math.floor(Config.GATE_MIN_NUMBER + (Math.random() * (Config.GATE_MAX_NUMBER - Config.GATE_MIN_NUMBER)));

        console.log('Track-builder - Build a track of ', numberOfGates, ' gates');

        let nextGatePosition = TrackBuilder.getNextGatePosition(1);

        for (let index = 0; index < numberOfGates; index++) {
            const gate = new Gate(nextGatePosition, index % 2 > 0 ? Color.Red : Color.Blue, index + 1);
            gates.push(gate);
            nextGatePosition = TrackBuilder.getNextGatePosition(index + 2, nextGatePosition);
        }

        gates.push(TrackBuilder.generateFinalGate(nextGatePosition.y));

        console.log(JSON.stringify(gates));

        return gates;
    }

    private static generateFinalGate(verticalPosition: number): Gate {
        return new Gate(vec(Config.FINAL_GATE_POSITION, verticalPosition), Color.Yellow, undefined, true);
    }

    private static getNextGatePosition(gateNumber: number, currentGatePosition?: Vector): Vector {
        if (!currentGatePosition) {
            return vec(Config.GATE_MAX_LEFT_POSITION + (Math.random() * (Config.HORIZONTAL_CAMERA_POINT * 0.3)), -Config.GATE_MIN_VERTICAL_DISTANCE);
        } else {
            const isNextLeft = gateNumber % 2 > 0;
            const nextHorizontalDistance = Config.GATE_MIN_HORIZONTAL_DISTANCE + (Math.random() * (Config.GATE_MAX_HORIZONTAL_DISTANCE - Config.GATE_MAX_HORIZONTAL_DISTANCE));
            const nextHorizontalPosition = isNextLeft ? Math.max(Config.GATE_MAX_LEFT_POSITION, currentGatePosition.x - nextHorizontalDistance) : Math.min(Config.GATE_MAX_RIGHT_POSITION, currentGatePosition.x + nextHorizontalDistance);
            const nextVerticalPosition = currentGatePosition.y - (Config.GATE_MIN_VERTICAL_DISTANCE + (Math.random() * (Config.GATE_MAX_VERTICAL_DISTANCE - Config.GATE_MIN_VERTICAL_DISTANCE)));
            return vec(nextHorizontalPosition, nextVerticalPosition);
        }

    }
}