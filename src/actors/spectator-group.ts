import { Actor, Color, Engine, Vector, vec } from 'excalibur';
import { Config } from '../config';
import { ScreenManager } from '../utils/screen-manager';
import { Spectator } from './spectator';

export class SpectatorGroup extends Actor {
	private engine: Engine;
	private direction: 'left' | 'right';
	private density: number;

	constructor(engine: Engine, position: Vector, density: number, direction: 'left' | 'right') {
		super({
			anchor: vec(0, 0),
			pos: position,
			height: density * Config.SPECTATOR_PRIVATE_SPACE_HEIGHT,
			width: Config.DISPLAY_MIN_MARGIN,
		});

		this.engine = engine;
		this.density = density;
		this.direction = direction;

		this.listenExitViewportEvent();
	}

	update(): void {
		if (ScreenManager.isNearScreen(this, this.scene.camera) && !this.children?.length) {
			this.buildSpectators();
		}
	}

	private listenExitViewportEvent(): void {
		this.on('exitviewport', () => this.checkForKill());
	}

	private checkForKill(): void {
		if (ScreenManager.isBehind(this.scene.camera.pos, this.pos)) {
			this.kill();
		}
	}

	private buildSpectators(): void {
		for (let i = 1; i <= this.density; i++) {
			const xPosition = Math.random() * (this.width - Config.SPECTATOR_PRIVATE_SPACE_WIDTH);
			const yPosition = i * Config.SPECTATOR_PRIVATE_SPACE_HEIGHT;
			const rotation = this.direction === 'left' ? 180 : 0;
			this.addChild(new Spectator(vec(xPosition, yPosition), rotation));
		}
	}
}
