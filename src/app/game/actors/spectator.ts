import {
    Actor,
    CollisionType,
    type Vector,
    toRadians,
    vec,
    type CollisionStartEvent,
    type Sound,
    CircleCollider,
    ColliderComponent,
    GraphicsGroup
} from 'excalibur';
import { Config } from '../config';
import { Skier } from './skier';
import type { Game } from '../game';
import type { Race } from '../scenes/race';
import { Resources } from '../resources';

export class Spectator extends Actor {
    private hitSound!: Sound;
    private originalPos!: Vector;

    constructor(position: Vector, rotation: number) {
        super({
            anchor: vec(0.5, 0.5),
            pos: position,
            width: Config.SPECTATOR_WIDTH,
            height: Config.SPECTATOR_HEIGHT,
            rotation: toRadians(rotation),
            collisionType: CollisionType.Active
        });

        this.collider = new ColliderComponent(new CircleCollider({ radius: Config.SPECTATOR_WIDTH / 2 }));

        this.originalPos = this.pos;
        const randomizer = Math.random();
        this.useRandomSpectatorGraphic(randomizer);
        this.useRandomHitSound(randomizer);

        this.on('collisionstart', evt => this.onPreCollision(evt));
    }

    override update(engine: Game, _delta: number): void {
        if (engine.settingsService.getSettings().spectatorsAnimation) {
            const distanceFromSkier = this.getGlobalPos().distance((this.scene as Race).skier!.pos);
            if (distanceFromSkier < Config.SPECTATORS_MAX_SOUND_DISTANCE) {
                this.lookAtSkier();
                this.excitingMove();
            }
        }
    }

    private useRandomSpectatorGraphic(randomizer: number): void {
        const spriteNumber = ~~(randomizer * Config.SPECTATOR_SPRITES.length);
        const graphics = new GraphicsGroup({
            members: [
                {
                    graphic: Config.SPECTATOR_SPRITES[spriteNumber],
                    offset: vec(0, 0)
                }
            ]
        });
        this.graphics.use(graphics);
    }

    private useRandomHitSound(randomizer: number): void {
        const soundNumber = ~~(randomizer * Config.SPECTATOR_HIT_SOUNDS.length);
        this.hitSound = Config.SPECTATOR_HIT_SOUNDS[soundNumber];
    }

    private onPreCollision(evt: CollisionStartEvent): void {
        if (evt.other.owner instanceof Skier) {
            (this.scene!.engine as Game).soundPlayer.playSound(
                this.hitSound,
                Config.SPECTATOR_HIT_SOUND_INTENSITY,
                false,
                true
            );
        }
    }

    private excitingMove(): void {
        if (!this.pos.distance(this.originalPos)) {
            const sideMove = Math.random() > 0.5 ? 0.5 : -0.5;
            const upMove = Math.random() > 0.5 ? 0.5 : -0.5;
            this.pos = vec(this.pos.x + sideMove, this.pos.y + upMove);
        } else {
            this.pos = this.originalPos;
        }
    }

    private lookAtSkier(): void {
        const skier = (this.scene as Race).skier!;
        const angle = Math.atan2(skier.pos.y - this.getGlobalPos().y, skier.pos.x - this.getGlobalPos().x);
        this.rotation = angle;
    }
}
