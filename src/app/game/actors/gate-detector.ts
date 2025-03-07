import { Actor, type CollisionStartEvent, CollisionType, Color, type Vector, vec } from 'excalibur';
import { Skier } from './skier';

export class GateDetector extends Actor {
    constructor(position: Vector, width: number, height: number, visible = false) {
        super({
            pos: position,
            width: width,
            height: height,
            anchor: vec(0, 1),
            collisionType: CollisionType.Passive,
            color: Color.fromHex('#9747ff'),
            opacity: visible ? 0.7 : 0
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
