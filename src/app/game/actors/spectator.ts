import {
    Actor,
    CollisionType,
    type Vector,
    toRadians,
    vec,
    type CollisionStartEvent,
    type Sound,
    CircleCollider
} from 'excalibur';
import { Config } from '../config';
import { Skier } from './skier';
import type { Game } from '../game';

export class Spectator extends Actor {
    private hitSound!: Sound;

    constructor(position: Vector, rotation: number) {
        super({
            anchor: vec(0, 1),
            pos: position,
            width: Config.SPECTATOR_WIDTH,
            height: Config.SPECTATOR_HEIGHT,
            rotation: toRadians(rotation),
            collisionType: CollisionType.Active,
            // collider: new CircleCollider({ radius: 10, offset: vec(-1, 1) })
        });

        const randomizer = Math.random();
        this.useRandomSpectatorGraphic(randomizer);
        this.useRandomHitSound(randomizer);
    }

    override onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    private useRandomSpectatorGraphic(randomizer: number): void {
        const spriteNumber = ~~(randomizer * Config.SPECTATOR_SPRITES.length);
        this.graphics.use(Config.SPECTATOR_SPRITES[spriteNumber]);
    }

    private useRandomHitSound(randomizer: number): void {
        const soundNumber = ~~(randomizer * Config.SPECTATOR_HIT_SOUNDS.length);
        this.hitSound = Config.SPECTATOR_HIT_SOUNDS[soundNumber];
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other instanceof Skier) {
            (this.scene!.engine as Game).soundPlayer.playSound(
                this.hitSound,
                Config.SPECTATOR_HIT_SOUND_INTENSITY,
                false,
                true
            );
        }
    }
}
