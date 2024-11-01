import { SkierActions } from './skier-actions.enum';

export class SkierPositioning {
	public x: number;
	public y: number;
	public rotation: number;
	public action: SkierActions;

	constructor(x: number, y: number, rotation: number, action: SkierActions) {
		this.x = x;
		this.y = y;
		this.rotation = rotation;
		this.action = action;
	}
}
