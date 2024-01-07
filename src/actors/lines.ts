import { Actor, Color, Line, Vector, vec } from "excalibur";

export class Lines extends Actor {
    constructor(endPosition: Vector) {
        console.log(endPosition.y);
        super({
            pos: vec(0, 0),
            width: 40,
            height: -endPosition.y,
            color: Color.Red
        });
    }
}
