import { Actor, CollisionType, Color, vec } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';

const COLLIDER_FRONT_NOTHING_ANCHOR = vec(0.5, 4);
const COLLIDER_FRONT_BRAKE_ANCHOR = vec(0.5, 4);
const COLLIDER_FRONT_CARVE_LEFT_ANCHOR = vec(0, 4);
const COLLIDER_FRONT_CARVE_RIGHT_ANCHOR = vec(1, 4);
const COLLIDER_FRONT_SLIDE_LEFT_ANCHOR = vec(0.6, 4);
const COLLIDER_FRONT_SLIDE_RIGHT_ANCHOR = vec(0.4, 4);

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
        switch (action) {
            case SkierActions.NOTHING:
                this.anchor = COLLIDER_FRONT_NOTHING_ANCHOR;
                break;
            case SkierActions.BRAKE:
                this.anchor = COLLIDER_FRONT_BRAKE_ANCHOR;
                break;
            case SkierActions.CARVE_LEFT:
                this.anchor = COLLIDER_FRONT_CARVE_LEFT_ANCHOR;
                break;
            case SkierActions.CARVE_RIGHT:
                this.anchor = COLLIDER_FRONT_CARVE_RIGHT_ANCHOR;
                break;
            case SkierActions.SLIDE_LEFT:
                this.anchor = COLLIDER_FRONT_SLIDE_LEFT_ANCHOR;
                break;
            case SkierActions.SLIDE_RIGHT:
                this.anchor = COLLIDER_FRONT_SLIDE_RIGHT_ANCHOR;
        }
    }
}
