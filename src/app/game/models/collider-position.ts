import type { Vector } from 'excalibur';

export interface ColliderPosition {
    anchor?: Vector;
    rotation?: number;
    width?: number;
}

export class SkiCollidersPosition {
    public left: ColliderPosition;
    public right: ColliderPosition;

    constructor(leftPosition: ColliderPosition, rightPosition: ColliderPosition) {
        this.left = leftPosition;
        this.right = rightPosition;
    }
}
