import type { TrackStyles } from './track-styles.enum';
import type { Animation, Sprite } from 'excalibur';

export type PoleColorConfig = 'blue' | 'red';
export type PoleSideConfig = 'left' | 'right';

export interface GatesConfig {
    trackStyle: TrackStyles;
    maxWidth: number;
    minWidth: number;
    maxHorizontalDistance: number;
    minVerticalDistance: number;
    maxVerticalDistance: number;
    minNumber: number;
    maxNumber: number;
    poleWidth: number;
    poleHeight: number;
    poleSprites: Map<PoleColorConfig, Sprite>;
    poleCheckSprites: Map<PoleColorConfig, Sprite>;
    poleCollideAnimations: Map<PoleColorConfig, Map<PoleSideConfig, Animation>>;
    followingGateAmount: number;
    doubleGateAmount: number;
    tripleGateAmount: number;
}
