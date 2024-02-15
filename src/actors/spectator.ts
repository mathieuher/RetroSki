import { Actor, CollisionType, Vector, toRadians, vec } from 'excalibur';
import { Config } from '../config';

export class Spectator extends Actor {
	constructor(position: Vector, rotation: number) {
		super({
			anchor: vec(0, 1),
			pos: position,
			width: 15,
			height: 18,
			rotation: toRadians(rotation),
			collisionType: CollisionType.Active,
		});

		this.useRandomSpectatorGraphic();
	}

	private useRandomSpectatorGraphic(): void {
		const spriteNumber = Math.floor(Math.random() * (Config.SPECTATOR_SPRITES.length - 1));
		this.graphics.use(Config.SPECTATOR_SPRITES[spriteNumber]);
	}
}
