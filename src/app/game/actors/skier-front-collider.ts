import { Actor, CollisionType, Color, vec } from 'excalibur';

export class SkierFrontCollider extends Actor {
    constructor() {
        super({
            anchor: vec(0.5, 8.5),
            width: 15,
            height: 2,
            collisionType: CollisionType.Passive
        });
    }
}
