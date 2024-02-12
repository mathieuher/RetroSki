import { Actor, CollisionStartEvent, CollisionType, Vector, vec, Color } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import { Skier } from './skier';
import { Game } from '../game';
import { GatesConfig } from '../models/gates-config';

export class Pole extends Actor {

    private poleColor: 'red' | 'blue';
    private gatesConfig: GatesConfig;

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

        this.poleColor = color;
        this.gatesConfig = gatesConfig;

        if (!isFinalPole) {
            this.graphics.use(gatesConfig.poleSprites.get(color)!);
        }
    }

    onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    public displayPoleCheck(): void {
        const checkLayer = this.graphics.layers.create({ name: 'check', order: 1, offset: vec(this.gatesConfig.poleWidth / 2, 0) })
        checkLayer.graphics.push({ graphic: this.gatesConfig.poleCheckSprites.get(this.poleColor)!, options: { anchor: vec(0.5, 2) } });
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
