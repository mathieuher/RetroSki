import type { Sprite } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';
import { Resources } from '../resources';

export class SkierGraphics {
    public static SKIER_SPRITE = Resources.Skier.toSprite();
    public static SKIER_SLIDING_SPRITE = Resources.SkierSliding.toSprite();
    public static SKIER_CARVING_SPRITE = Resources.SkierCarving.toSprite();
    public static SKIER_BRAKING_SPRITE = Resources.SkierBraking.toSprite();
    public static EVENT_GHOST_SPRITE = Resources.EventRecordGhost.toSprite();
    public static EVENT_GHOST_SLIDING_SPRITE = Resources.EventRecordGhostSliding.toSprite();
    public static EVENT_GHOST_CARVING_SPRITE = Resources.EventRecordGhostCarving.toSprite();
    public static EVENT_GHOST_BRAKING_SPRITE = Resources.EventRecordGhostBraking.toSprite();
    public static GLOBAL_GHOST_SPRITE = Resources.GlobalGhostSkier.toSprite();
    public static GLOBAL_GHOST_SLIDING_SPRITE = Resources.GlobalGhostSkierSliding.toSprite();
    public static GLOBAL_GHOST_CARVING_SPRITE = Resources.GlobalGhostSkierCarving.toSprite();
    public static GLOBAL_GHOST_BRAKING_SPRITE = Resources.GlobalGhostSkierBraking.toSprite();

    public static getSpriteForAction(
        type: 'skier' | 'globalRecordGhost' | 'eventRecordGhost',
        action: SkierActions
    ): { sprite: Sprite; flipHorizontal?: boolean } {
        if (action === SkierActions.SLIDE_LEFT || action === SkierActions.SLIDE_RIGHT) {
            const flipHorizontal = action === SkierActions.SLIDE_LEFT;
            if (type === 'skier') {
                return { sprite: SkierGraphics.SKIER_SLIDING_SPRITE, flipHorizontal: flipHorizontal };
            }
            if (type === 'globalRecordGhost') {
                return { sprite: SkierGraphics.GLOBAL_GHOST_SLIDING_SPRITE, flipHorizontal: flipHorizontal };
            }
            return { sprite: SkierGraphics.EVENT_GHOST_SLIDING_SPRITE, flipHorizontal: flipHorizontal };
        }
        if (action === SkierActions.BRAKE) {
            if (type === 'skier') {
                return { sprite: SkierGraphics.SKIER_BRAKING_SPRITE };
            }
            if (type === 'globalRecordGhost') {
                return { sprite: SkierGraphics.GLOBAL_GHOST_BRAKING_SPRITE };
            }
            return { sprite: SkierGraphics.EVENT_GHOST_BRAKING_SPRITE };
        }
        if (action === SkierActions.CARVE_LEFT || action === SkierActions.CARVE_RIGHT) {
            const flipHorizontal = action === SkierActions.CARVE_LEFT;
            if (type === 'skier') {
                return { sprite: SkierGraphics.SKIER_CARVING_SPRITE, flipHorizontal: flipHorizontal };
            }
            if (type === 'globalRecordGhost') {
                return { sprite: SkierGraphics.GLOBAL_GHOST_CARVING_SPRITE, flipHorizontal: flipHorizontal };
            }
            return { sprite: SkierGraphics.EVENT_GHOST_CARVING_SPRITE, flipHorizontal: flipHorizontal };
        }
        if (type === 'skier') {
            return { sprite: SkierGraphics.SKIER_SPRITE, flipHorizontal: false };
        }
        if (type === 'globalRecordGhost') {
            return { sprite: SkierGraphics.GLOBAL_GHOST_SPRITE };
        }
        return { sprite: SkierGraphics.EVENT_GHOST_SPRITE };
    }
}
