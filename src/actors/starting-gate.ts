import { Actor, Vector } from "excalibur";
import { Resources } from "../resources";

export class StartingGate extends Actor {
    constructor(anchor: Vector, position: Vector) {
        super({
            anchor: anchor,
            pos: position,
            width: 70,
            height: 5,
        });

        this.graphics.use(Resources.StartingGate.toSprite());
    }
}
