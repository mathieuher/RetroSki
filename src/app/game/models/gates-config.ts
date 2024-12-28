import type { TrackStyles } from './track-styles.enum';
import type { Sprite } from 'excalibur';

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
    poleSprites: Map<string, Sprite>;
    poleCheckSprites: Map<string, Sprite>;
    poleShadow: Sprite;
}
