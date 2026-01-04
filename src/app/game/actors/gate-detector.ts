import { Actor, type CollisionStartEvent, CollisionType, Color, type Vector, vec } from 'excalibur';
import { GATE_COLLISION_GROUP, type Gate } from './gate';
import { SkisCollider } from './skis-collider';

export class GateDetector extends Actor {
    private gate: Gate;

    constructor(gate: Gate, position: Vector, width: number, height: number, visible = false) {
        super({
            pos: position,
            width: width,
            height: height,
            anchor: vec(0, 1),
            collisionType: CollisionType.Passive,
            collisionGroup: GATE_COLLISION_GROUP,
            color: Color.fromHex('#9747ff'),
            opacity: visible ? 0.7 : 0
        });

        this.gate = gate;
    }

    override onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    private onPreCollision(event: CollisionStartEvent): void {
        if (event.other.owner instanceof SkisCollider) {
            this.gate.emit('passed');
        }
    }
}
