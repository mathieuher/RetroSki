import { Actor, CollisionStartEvent, CollisionType, Engine, PreCollisionEvent, Vector, vec } from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources";
import { Skier } from "./skier";
import { Game } from "src/game";

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
        this.on('collisionstart', (evt) => this.onPreCollision(evt));
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other instanceof Skier) {
            (this.scene.engine as Game).soundPlayer.playSound(Resources.PoleHittingSound, 0.2);
        }

    }
}
