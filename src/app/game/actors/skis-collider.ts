import { Actor, CollisionType, Color, PolygonCollider, vec, type Vector } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';

// Definition of skis collider regarding skier position
const NOTHING_COLLIDER_POINTS = [vec(7, -15), vec(-7, -15), vec(-7, 15), vec(7, 15)];
const BRAKE_COLLIDER_POINTS = [vec(4, -13), vec(-4, -13), vec(-16, 15), vec(16, 15)];
const CARVE_LEFT_COLLIDER_POINTS = [vec(12, -13), vec(0, -16), vec(0, 12), vec(12, 15)];
const CARVE_RIGHT_COLLIDER_POINTS = [vec(0, -16), vec(-12, -13), vec(-12, 15), vec(0, 12)];
const SLIDE_LEFT_COLLIDER_POINTS = [vec(2, -15), vec(-8, -15), vec(5, 12), vec(15, 13)];
const SLIDE_RIGHT_COLLIDER_POINTS = [vec(8, -15), vec(-2, -15), vec(-15, 13), vec(-5, 12)];

export class SkisCollider extends Actor {
    constructor() {
        super({
            anchor: vec(0.5, 0.5),
            width: 32,
            height: 32,
            collisionType: CollisionType.Fixed
        });

        this.collider.usePolygonCollider(NOTHING_COLLIDER_POINTS);
    }

    public updatePosition(skierAction: SkierActions): void {
        let colliderPoints: Vector[] = NOTHING_COLLIDER_POINTS;
        if (skierAction === SkierActions.BRAKE) {
            colliderPoints = BRAKE_COLLIDER_POINTS;
        }
        if (skierAction === SkierActions.CARVE_LEFT) {
            colliderPoints = CARVE_LEFT_COLLIDER_POINTS;
        }
        if (skierAction === SkierActions.CARVE_RIGHT) {
            colliderPoints = CARVE_RIGHT_COLLIDER_POINTS;
        }
        if (skierAction === SkierActions.SLIDE_LEFT) {
            colliderPoints = SLIDE_LEFT_COLLIDER_POINTS;
        }
        if (skierAction === SkierActions.SLIDE_RIGHT) {
            colliderPoints = SLIDE_RIGHT_COLLIDER_POINTS;
        }
        this.collider.usePolygonCollider(colliderPoints);
    }
}
