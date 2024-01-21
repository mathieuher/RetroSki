import { Sprite } from "excalibur";
import { SkierActions } from "../models/skier-actions.enum";
import { Resources } from "../resources";

export class SkierGraphics {
    public static getSpriteForAction(type: 'skier' | 'globalRecordGhost' | 'eventRecordGhost', action: SkierActions): { sprite: Sprite, flipHorizontal?: boolean } {
        if (action === SkierActions.SLIDE_LEFT || action === SkierActions.SLIDE_RIGHT) {
            const flipHorizontal = action === SkierActions.SLIDE_LEFT;
            if (type === 'skier') {
                return { sprite: Resources.SkierSliding.toSprite(), flipHorizontal: flipHorizontal };
            } else if (type === 'globalRecordGhost') {
                return { sprite: Resources.GlobalGhostSkierSliding.toSprite(), flipHorizontal: flipHorizontal };
            } else {
                return { sprite: Resources.EventRecordGhostSliding.toSprite(), flipHorizontal: flipHorizontal };
            }
        } else if (action === SkierActions.BRAKE) {
            if (type === 'skier') {
                return { sprite: Resources.SkierBraking.toSprite() };
            } else if (type === 'globalRecordGhost') {
                return { sprite: Resources.GlobalGhostSkierBraking.toSprite() };
            } else {
                return { sprite: Resources.EventRecordGhostBraking.toSprite() };
            }
        } else if (action === SkierActions.CARVE_LEFT || action === SkierActions.CARVE_RIGHT) {
            const flipHorizontal = action === SkierActions.CARVE_LEFT;
            if (type === 'skier') {
                return { sprite: Resources.SkierCarving.toSprite(), flipHorizontal: flipHorizontal };
            } else if (type === 'globalRecordGhost') {
                return { sprite: Resources.GlobalGhostSkierCarving.toSprite(), flipHorizontal: flipHorizontal };
            } else {
                return { sprite: Resources.EventRecordGhostCarving.toSprite(), flipHorizontal: flipHorizontal };
            }
        } else {
            if (type === 'skier') {
                return { sprite: Resources.Skier.toSprite(), flipHorizontal: false };
            } else if (type === 'globalRecordGhost') {
                return { sprite: Resources.GlobalGhostSkier.toSprite() };
            } else {
                return { sprite: Resources.GlobalGhostSkier.toSprite() };
            }
        }
    }
}