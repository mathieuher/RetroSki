import type { Vector } from 'excalibur';

export class StockableSlopeSection {
    public startX: number;
    public startY: number;
    public endX: number;
    public endY: number;
    public incline: number;

    constructor(startPosition: Vector, endPosition: Vector, incline: number) {
        this.startX = startPosition.x;
        this.startY = startPosition.y;
        this.endX = endPosition.x;
        this.endY = endPosition.y;
        this.incline = incline;
    }
}
