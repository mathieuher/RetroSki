import { Actor, CollisionType, vec } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';

// Skier body collider anchors regarding skier position
const COLLIDER_BODY_NOTHING_ANCHOR = vec(0.5, 0.5);
const COLLIDER_BODY_BRAKE_ANCHOR = vec(0.5, 0.3);
const COLLIDER_BODY_CARVE_LEFT_ANCHOR = vec(0.7, 0.5);
const COLLIDER_BODY_CARVE_RIGHT_ANCHOR = vec(0.3, 0.5);
const COLLIDER_BODY_SLIDE_LEFT_ANCHOR = vec(0.55, 0.5);
const COLLIDER_BODY_SLIDE_RIGHT_ANCHOR = vec(0.45, 0.5);

export class SkierBodyCollider extends Actor {
    constructor() {
        super({
            anchor: COLLIDER_BODY_NOTHING_ANCHOR,
            width: 22,
            height: 12,
            collisionType: CollisionType.Passive
        });
    }

    public updatePosition(action: SkierActions): void {
        switch (action) {
            case SkierActions.NOTHING:
                this.anchor = COLLIDER_BODY_NOTHING_ANCHOR;
                break;
            case SkierActions.BRAKE:
                this.anchor = COLLIDER_BODY_BRAKE_ANCHOR;
                break;
            case SkierActions.CARVE_LEFT:
                this.anchor = COLLIDER_BODY_CARVE_LEFT_ANCHOR;
                break;
            case SkierActions.CARVE_RIGHT:
                this.anchor = COLLIDER_BODY_CARVE_RIGHT_ANCHOR;
                break;
            case SkierActions.SLIDE_LEFT:
                this.anchor = COLLIDER_BODY_SLIDE_LEFT_ANCHOR;
                break;
            case SkierActions.SLIDE_RIGHT:
                this.anchor = COLLIDER_BODY_SLIDE_RIGHT_ANCHOR;
        }
    }
}
