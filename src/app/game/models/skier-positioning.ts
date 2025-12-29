import type { SkierActions } from './skier-actions.enum';

export class SkierPositioning {
    public x: number;
    public y: number;
    public rotation: number;
    public action: SkierActions;
    public incline?: number;

    constructor(x: number, y: number, rotation: number, action: SkierActions, incline: number) {
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.action = action;
        this.incline = incline;
    }
}
