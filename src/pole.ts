import { Actor, CollisionType, Color, Vector, vec } from "excalibur";
import { Config } from "./config";

export class Pole extends Actor {
    constructor(position: Vector, color: Color) {
        super({
            pos: position,
            width: Config.POLE_WIDTH,
            height: Config.POLE_HEIGHT,
            color: color,
            anchor: vec(0, 0.5),
            collisionType: CollisionType.Active
        });
    }

    onInitialize() {
    }
}
