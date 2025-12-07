import { Actor, CollisionType, Color, vec } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';
import { Config } from '../config';

export class SkierBodyCollider extends Actor {
    constructor() {
        super({
            anchor: Config.COLLIDER_BODY_NOTHING.anchor,
            width: 22,
            height: 12,
            rotation: Config.COLLIDER_BODY_NOTHING.rotation,
            collisionType: CollisionType.Passive
        });
    }

    public updatePosition(action: SkierActions): void {
        if (action === SkierActions.NOTHING) {
            this.anchor = Config.COLLIDER_BODY_NOTHING.anchor!;
            this.rotation = Config.COLLIDER_BODY_NOTHING.rotation!;
        }
        if (action === SkierActions.BRAKE) {
            this.anchor = Config.COLLIDER_BODY_BRAKE.anchor!;
            this.rotation = Config.COLLIDER_BODY_BRAKE.rotation!;
        }
        if (action === SkierActions.CARVE_LEFT) {
            this.anchor = Config.COLLIDER_BODY_CARVE_LEFT.anchor!;
            this.rotation = Config.COLLIDER_BODY_CARVE_LEFT.rotation!;
        }
        if (action === SkierActions.CARVE_RIGHT) {
            this.anchor = Config.COLLIDER_BODY_CARVE_RIGHT.anchor!;
            this.rotation = Config.COLLIDER_BODY_CARVE_RIGHT.rotation!;
        }
        if (action === SkierActions.SLIDE_LEFT) {
            this.anchor = Config.COLLIDER_BODY_SLIDE_LEFT.anchor!;
            this.rotation = Config.COLLIDER_BODY_SLIDE_LEFT.rotation!;
        }
        if (action === SkierActions.SLIDE_RIGHT) {
            this.anchor = Config.COLLIDER_BODY_SLIDE_RIGHT.anchor!;
            this.rotation = Config.COLLIDER_BODY_SLIDE_RIGHT.rotation!;
        }
    }
}
