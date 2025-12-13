import { Actor, type CollisionStartEvent, CollisionType, type Vector, vec, Color, GraphicsGroup } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import type { Game } from '../game';
import type { GatesConfig, PoleSideConfig } from '../models/gates-config';
import { TrackStyles } from '../models/track-styles.enum';
import { SkierBodyCollider } from './skier-body-collider';
import type { Race } from '../scenes/race';
import { SkisCollider } from './skis-collider';

class PoleCollider extends Actor {
    constructor(width: number) {
        super({
            width: width,
            height: 10,
            anchor: vec(0, 1.3),
            collisionType: CollisionType.Passive,
            z: 10
        });
    }

    override onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other.owner instanceof SkierBodyCollider) {
            (this.parent as Pole).animate();
            (this.scene!.engine as Game).soundPlayer.playSound(Resources.PoleHitSound, Config.POLE_HIT_SOUND_VOLUME);
        }
    }
}

export class Pole extends Actor {
    private poleColor: 'red' | 'blue';
    private gatesConfig: GatesConfig;
    private graphicsGroup?: GraphicsGroup;

    private poleCollider: PoleCollider;

    constructor(position: Vector, color: 'red' | 'blue', gatesConfig: GatesConfig, isFinalPole: boolean) {
        super({
            pos: position,
            width: isFinalPole ? Config.FINAL_POLE_WIDTH : gatesConfig.poleWidth,
            height: isFinalPole ? Config.FINAL_POLE_HEIGHT : gatesConfig.poleHeight,
            anchor: gatesConfig.trackStyle === TrackStyles.SL ? vec(0.4, 0.9) : vec(0.3, 0.9),
            collisionType: CollisionType.Active,
            color: isFinalPole ? Color.fromHex('#DA2F2F') : Color.Transparent,
            z: 3
        });

        this.poleCollider = new PoleCollider(this.width);
        this.addChild(this.poleCollider);
        this.poleColor = color;
        this.gatesConfig = gatesConfig;

        this.updateGraphics(gatesConfig, color, isFinalPole);
    }

    override onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    public displayPoleCheck(): void {
        this.graphicsGroup?.members.push({
            graphic: this.gatesConfig.poleCheckSprites.get(this.poleColor)!,
            useBounds: false,
            offset: this.gatesConfig.trackStyle === TrackStyles.SL ? vec(10, -8) : vec(12, -6)
        });
    }

    public animate(): void {
        const skierPos = (this.scene as Race).skier?.globalPos.x;
        const side: PoleSideConfig = skierPos! <= this.globalPos.x ? 'left' : 'right';

        const animation = this.gatesConfig.poleCollideAnimations.get(this.poleColor)?.get(side)?.clone();

        if (animation) {
            this.graphicsGroup?.members.splice(0, 1, animation);
        }
    }

    private updateGraphics(config: GatesConfig, color: 'red' | 'blue', isFinalPole: boolean): void {
        if (isFinalPole) {
            return;
        }

        this.graphicsGroup = new GraphicsGroup({
            members: [
                {
                    graphic: config.poleSprites.get(color)!,
                    offset: vec(0, 0)
                }
            ]
        });

        this.graphics.use(this.graphicsGroup);
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other.owner instanceof SkisCollider) {
            (this.scene!.engine as Game).soundPlayer.playSound(Resources.PoleBumpSound, Config.POLE_HIT_SOUND_VOLUME);

            // Straddled the pole if it is moving a sufficient amount
            if (evt.contact.mtv.distance() >= Config.POLE_STRADDLED_DISTANCE_LIMIT) {
                this.parent?.emit('straddled');
            }
        }
    }
}
