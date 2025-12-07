import { Actor, CollisionType, Color, type Vector } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';
import { Config } from '../config';

type SkiColliderSide = 'left' | 'right';

export class SkiCollider extends Actor {
    private side: SkiColliderSide;
    constructor(side: SkiColliderSide) {
        super({
            anchor: Config.COLLIDER_SKI_NOTHING[side].anchor,
            width: 8,
            height: 23,
            rotation: Config.COLLIDER_SKI_NOTHING[side].rotation,
            collisionType: CollisionType.Fixed
        });

        this.side = side;
    }

    public updatePosition(skierAction: SkierActions): void {
        if (skierAction === SkierActions.NOTHING) {
            this.anchor = Config.COLLIDER_SKI_NOTHING[this.side].anchor!;
            this.rotation = Config.COLLIDER_SKI_NOTHING[this.side].rotation!;
        }
        if (skierAction === SkierActions.BRAKE) {
            this.anchor = Config.COLLIDER_SKI_BRAKE[this.side].anchor!;
            this.rotation = Config.COLLIDER_SKI_BRAKE[this.side].rotation!;
        }
        if (skierAction === SkierActions.CARVE_LEFT) {
            this.anchor = Config.COLLIDER_SKI_CARVE_LEFT[this.side].anchor!;
            this.rotation = Config.COLLIDER_SKI_CARVE_LEFT[this.side].rotation!;
        }
        if (skierAction === SkierActions.CARVE_RIGHT) {
            this.anchor = Config.COLLIDER_SKI_CARVE_RIGHT[this.side].anchor!;
            this.rotation = Config.COLLIDER_SKI_CARVE_RIGHT[this.side].rotation!;
        }
        if (skierAction === SkierActions.SLIDE_LEFT) {
            this.anchor = Config.COLLIDER_SKI_SLIDE_LEFT[this.side].anchor!;
            this.rotation = Config.COLLIDER_SKI_SLIDE_LEFT[this.side].rotation!;
        }
        if (skierAction === SkierActions.SLIDE_RIGHT) {
            this.anchor = Config.COLLIDER_SKI_SLIDE_RIGHT[this.side].anchor!;
            this.rotation = Config.COLLIDER_SKI_SLIDE_RIGHT[this.side].rotation!;
        }
    }
}
