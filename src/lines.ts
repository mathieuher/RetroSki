import { Actor, Color, Engine, Line, Vector, vec } from "excalibur";

export class Lines extends Actor {
    constructor(engine: Engine, position: Vector) {
        super({
            pos: position
        });
    }

    onInitialize() {
    }

    public movePosition(startPosition: Vector, endPosition: Vector): void {
        const line = new Line({
            start: startPosition,
            end: endPosition,
            color: Color.Red,
            thickness: 50
        });

        this.graphics.add(line);
    }
}
