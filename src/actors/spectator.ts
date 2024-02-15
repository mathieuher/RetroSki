import { Actor, CollisionType, Vector, toRadians, vec, CollisionStartEvent } from 'excalibur';
import { Config } from '../config';
import { Skier } from './skier';
import { Game } from '../game';
import { Resources } from '../resources';

export class Spectator extends Actor {
    constructor(position: Vector, rotation: number) {
        super({
            anchor: vec(0, 1),
            pos: position,
            width: Config.SPECTATOR_WIDTH,
            height: Config.SPECTATOR_HEIGHT,
            rotation: toRadians(rotation),
            collisionType: CollisionType.Active,
        });

        this.useRandomSpectatorGraphic();


    }

    onInitialize() {
        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    private useRandomSpectatorGraphic(): void {
        const spriteNumber = Math.floor(Math.random() * (Config.SPECTATOR_SPRITES.length - 1));
        this.graphics.use(Config.SPECTATOR_SPRITES[spriteNumber]);
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other instanceof Skier) {
            (this.scene.engine as Game).soundPlayer.playSound(
                Resources.SpectatorHitSound,
                0.5,
                false,
                true
            );
        }
    }
}
