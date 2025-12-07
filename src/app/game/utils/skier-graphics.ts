import { SpriteSheet, type Sprite } from 'excalibur';
import { SkierActions } from '../models/skier-actions.enum';
import { Resources } from '../resources';
import { Config } from '../config';

const skierSpritesheetGrid = {
    rows: 1,
    columns: Config.ANIMATION_FRAME_AMOUNT,
    spriteHeight: 32,
    spriteWidth: 32
};

export class SkierGraphics {
    public static SKIER_SPRITE = Resources.Skier.toSprite();
    public static SKIER_SLIDING_SPRITESHEET = SpriteSheet.fromImageSource({
        image: Resources.SkierSliding,
        grid: skierSpritesheetGrid
    });
    public static SKIER_CARVING_SPRITESHEET = SpriteSheet.fromImageSource({
        image: Resources.SkierCarving,
        grid: skierSpritesheetGrid
    });
    public static SKIER_BRAKING_SPRITESHEET = SpriteSheet.fromImageSource({
        image: Resources.SkierBraking,
        grid: skierSpritesheetGrid
    });
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
        action: SkierActions,
        intensity?: number
    ): { sprite: Sprite; flipHorizontal?: boolean } {
        // Get the index of sprite (0 - 5) regarding the intensity of the action;
        const intensityIndex =
            intensity !== undefined
                ? Math.min(Math.floor(intensity / Config.ANIMATION_FRAME_DURATION), Config.ANIMATION_FRAME_AMOUNT - 1)
                : Config.ANIMATION_FRAME_AMOUNT - 1;

        if (action === SkierActions.SLIDE_LEFT || action === SkierActions.SLIDE_RIGHT) {
            const flipHorizontal = action === SkierActions.SLIDE_LEFT;
            if (type === 'skier') {
                return {
                    sprite: SkierGraphics.SKIER_SLIDING_SPRITESHEET.getSprite(intensityIndex, 0),
                    flipHorizontal: !flipHorizontal
                };
            }
            if (type === 'globalRecordGhost') {
                return { sprite: SkierGraphics.GLOBAL_GHOST_SLIDING_SPRITE, flipHorizontal: flipHorizontal };
            }
            return { sprite: SkierGraphics.EVENT_GHOST_SLIDING_SPRITE, flipHorizontal: flipHorizontal };
        }
        if (action === SkierActions.BRAKE) {
            if (type === 'skier') {
                return { sprite: SkierGraphics.SKIER_BRAKING_SPRITESHEET.getSprite(intensityIndex, 0) };
            }
            if (type === 'globalRecordGhost') {
                return { sprite: SkierGraphics.GLOBAL_GHOST_BRAKING_SPRITE };
            }
            return { sprite: SkierGraphics.EVENT_GHOST_BRAKING_SPRITE };
        }
        if (action === SkierActions.CARVE_LEFT || action === SkierActions.CARVE_RIGHT) {
            const flipHorizontal = action === SkierActions.CARVE_LEFT;
            if (type === 'skier') {
                return {
                    sprite: SkierGraphics.SKIER_CARVING_SPRITESHEET.getSprite(intensityIndex, 0),
                    flipHorizontal: !flipHorizontal
                };
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
