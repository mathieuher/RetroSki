import { Actor, CollisionStartEvent, CollisionType, Vector, vec, Color } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import { Skier } from './skier';
import { Game } from '../game';
import { GatesConfig } from '../models/gates-config';

export class Pole extends Actor {
    constructor(position: Vector, color: 'red' | 'blue', gatesConfig: GatesConfig, isFinalPole: boolean) {
        super({
            pos: position,
            width: isFinalPole ? Config.FINAL_POLE_WIDTH : gatesConfig.poleWidth,
            height: isFinalPole ? Config.FINAL_POLE_HEIGHT : gatesConfig.poleHeight,
            anchor: vec(0, 0.5),
            collisionType: CollisionType.Active,
            color: isFinalPole ? Color.fromHex('#DA2F2F') : Color.Transparent,
            z: 5,
        });

        if (!isFinalPole) {
            this.graphics.use(color === 'red' ? Resources.PoleRed.toSprite() : Resources.PoleBlue.toSprite());
        }
    }

    onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other instanceof Skier) {
            (this.scene.engine as Game).soundPlayer.playSound(
                Resources.PoleHittingSound,
                Config.POLE_HIT_SOUND_VOLUME,
            );
        }
    }
}
