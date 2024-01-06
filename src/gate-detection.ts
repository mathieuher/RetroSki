import { ActionsComponent, Actor, CollisionStartEvent, CollisionType, Color, Engine, PreCollisionEvent, Scene, Vector, vec } from "excalibur";
import { Config } from "./config";
import { Player } from "./player";

export class GateDetection extends Actor {
    constructor(engine: Engine, position: Vector, width: number) {
        super({
            pos: position,
            width: width,
            height: Config.POLE_HEIGHT,
            // color: Color.Cyan,
            anchor: vec(0, 0.5),
            collisionType: CollisionType.Active
        });
    }

    onInitialize() {
        this.on('precollision', (evt) => this.onPreCollision(evt));
    }

    private onPreCollision(event: PreCollisionEvent): void {
        if (event.other instanceof Player) {
            this.parent.emit('passed');
            this.kill();
        }
    }
}
