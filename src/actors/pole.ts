import { Actor, CollisionType, Color, Vector, vec } from "excalibur";
import { Config } from "../config";

export class Pole extends Actor {
    constructor(position: Vector, color: Color, isFinalPole = false) {
        super({
            pos: position,
            width: isFinalPole ? Config.FINAL_POLE_WIDTH : Config.POLE_WIDTH,
            height: isFinalPole ? Config.FINAL_POLE_HEIGHT : Config.POLE_HEIGHT,
            color: color,
            anchor: vec(0, 0.5),
            collisionType: CollisionType.Active
        });
    }

    onInitialize() {
    }
}
