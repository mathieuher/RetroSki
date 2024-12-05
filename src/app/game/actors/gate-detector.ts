import { Actor, CollisionStartEvent, CollisionType, type PreCollisionEvent, type Vector, vec } from 'excalibur';
import { Skier } from './skier';

export class GateDetector extends Actor {
    constructor(position: Vector, width: number, height: number, isFinalDetection = false) {
        super({
            pos: position,
            width: width,
            height: height,
            anchor: vec(0, isFinalDetection ? 0.5 : 0),
            collisionType: CollisionType.Passive
        });
    }

    override onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    private onPreCollision(event: CollisionStartEvent): void {
        if (event.other.owner instanceof Skier) {
            this.parent!.emit('passed');
            this.kill();
        }
    }
}
