import { Actor, CollisionType, Vector, vec } from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources";

export class Pole extends Actor {
    constructor(position: Vector, color: 'red' | 'blue', isFinalPole = false) {
        super({
            pos: position,
            width: isFinalPole ? Config.FINAL_POLE_WIDTH : Config.POLE_WIDTH,
            height: isFinalPole ? Config.FINAL_POLE_HEIGHT : Config.POLE_HEIGHT,
            anchor: vec(0, 0.5),
            collisionType: CollisionType.Active
        });

        if (isFinalPole) {
            this.graphics.use(Resources.FinalPole.toSprite());
        } else {
            this.graphics.use(color === 'red' ? Resources.PoleRed.toSprite() : Resources.PoleBlue.toSprite());
        }
    }

    onInitialize() {
    }
}
