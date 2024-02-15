import { Actor, Color, Engine, Vector } from 'excalibur';
import { Config } from '../config';

export class SpectatorGroup extends Actor {
	private engine: Engine;
	private density: number;

	constructor(engine: Engine, position: Vector, density: number) {
		super({
			pos: position,
			height: density * 30,
			width: Config.DISPLAY_MIN_MARGIN,
			color: Color.Red,
		});

		this.engine = engine;
		this.density = density;
	}
}
