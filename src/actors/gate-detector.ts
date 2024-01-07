import { Actor, CollisionType, PreCollisionEvent, Vector, vec } from "excalibur";
import { Skier } from "./skier";
import { Config } from "../config";

export class GateDetector extends Actor {
    constructor(position: Vector, width: number, isFinalDetection = false) {
        super({
            pos: position,
            width: width,
            height: isFinalDetection ? Config.FINAL_POLE_HEIGHT : Config.POLE_HEIGHT / 2,
            anchor: vec(0, isFinalDetection ? 0.5 : -0.5),
            collisionType: CollisionType.Passive,
        });
    }

    onInitialize() {
        this.on('precollision', (evt) => this.onPreCollision(evt));
    }

    private onPreCollision(event: PreCollisionEvent): void {
        if (event.other instanceof Skier) {
            this.parent.emit('passed');
            this.kill();
        }
    }
}
