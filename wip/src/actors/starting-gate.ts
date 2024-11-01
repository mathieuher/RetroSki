import { Actor, Vector } from 'excalibur';
import { Resources } from '../resources';

export class StartingGate extends Actor {
	constructor(anchor: Vector, position: Vector) {
		super({
			anchor: anchor,
			pos: position,
			width: 42,
			height: 3,
		});

		this.graphics.use(Resources.StartingGate.toSprite());
	}
}
