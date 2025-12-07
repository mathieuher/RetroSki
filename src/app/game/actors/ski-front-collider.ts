import { Actor, CollisionType, Color, vec } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';
import { Config } from '../config';

export class SkiFrontCollider extends Actor {
    constructor() {
        super({
            anchor: vec(0.5, 4),
            width: 11,
            height: 4,
            collisionType: CollisionType.Passive
        });
    }

    public updatePosition(action: SkierActions): void {
        if (action === SkierActions.NOTHING) {
            this.anchor = Config.COLLIDER_FRONT_NOTHING.anchor!;
        }
        if (action === SkierActions.BRAKE) {
            this.anchor = Config.COLLIDER_FRONT_BRAKE.anchor!;
        }
        if (action === SkierActions.CARVE_LEFT) {
            this.anchor = Config.COLLIDER_FRONT_CARVE_LEFT.anchor!;
        }
        if (action === SkierActions.CARVE_RIGHT) {
            this.anchor = Config.COLLIDER_FRONT_CARVE_RIGHT.anchor!;
        }
        if (action === SkierActions.SLIDE_LEFT) {
            this.anchor = Config.COLLIDER_FRONT_SLIDE_LEFT.anchor!;
        }
        if (action === SkierActions.SLIDE_RIGHT) {
            this.anchor = Config.COLLIDER_FRONT_SLIDE_RIGHT.anchor!;
        }
    }
}
