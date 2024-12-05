import { Actor, type CollisionStartEvent, CollisionType, type Vector, vec, Color, GraphicsGroup } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import { Skier } from './skier';
import type { Game } from '../game';
import type { GatesConfig } from '../models/gates-config';
import { TrackStyles } from '../models/track-styles.enum';

export class Pole extends Actor {
    private poleColor: 'red' | 'blue';
    private gatesConfig: GatesConfig;
    private graphicsGroup: GraphicsGroup;

    constructor(position: Vector, color: 'red' | 'blue', gatesConfig: GatesConfig, isFinalPole: boolean) {
        super({
            pos: position,
            width: isFinalPole ? Config.FINAL_POLE_WIDTH : gatesConfig.poleWidth,
            height: isFinalPole ? Config.FINAL_POLE_HEIGHT : gatesConfig.poleHeight,
            anchor: vec(0, 0.5),
            collisionType: CollisionType.Active,
            color: isFinalPole ? Color.fromHex('#DA2F2F') : Color.Transparent,
            z: 5
        });

        this.poleColor = color;
        this.gatesConfig = gatesConfig;
        this.graphicsGroup = new GraphicsGroup({
            members: [{
                graphic: gatesConfig.poleSprites.get(color)!,
                offset: vec(0, 0)
            }]
        });

        if (!isFinalPole) {
            this.graphics.use(this.graphicsGroup);
        }
    }

    override onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    public displayPoleCheck(): void {
        this.graphicsGroup.members.push({
            graphic: this.gatesConfig.poleCheckSprites.get(this.poleColor)!,
            useBounds: false,
            offset: this.gatesConfig.trackStyle === TrackStyles.SL ? vec(-2.5, -15): vec(2, -15)
        });
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other instanceof Skier) {
            (this.scene!.engine as Game).soundPlayer.playSound(
                Resources.PoleHittingSound,
                Config.POLE_HIT_SOUND_VOLUME
            );
        }
    }
}
