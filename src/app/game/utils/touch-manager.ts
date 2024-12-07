import type { Engine, Vector } from 'excalibur';
import { Config } from '../config';

export class TouchManager {
    private engine: Engine;

    private activePointers: Map<number, 'back' | 'left' | 'right'> = new Map();

    public isTouching = false;
    public isTouchingBack = false;
    public isTouchingLeft = false;
    public isTouchingRight = false;

    constructor(engine: Engine) {
        this.engine = engine;
        this.listenTouch();
    }

    private listenTouch(): void {
        this.engine.input.pointers.on('down', event => {
            this.recomputeTouchStatus(event.pointerId, 'down', event.pagePos);
        });

        this.engine.input.pointers.on('up', event => {
            this.recomputeTouchStatus(event.pointerId, 'up', event.pagePos);
        });
    }

    private recomputeTouchStatus(pointerId: number, type: 'down' | 'up', position: Vector): void {
        if (type === 'down') {
            this.activePointers.set(pointerId, this.getTouchZone(position));
        } else {
            this.activePointers.delete(pointerId);
        }

        this.isTouchingBack = this.activePointers.get(pointerId) === 'back';
        this.isTouchingLeft = this.activePointers.get(pointerId) === 'left';
        this.isTouchingRight = this.activePointers.get(pointerId) === 'right';

        this.isTouching = this.isTouchingBack || this.isTouchingLeft || this.isTouchingRight;
    }

    private getTouchZone(position: Vector): 'back' | 'left' | 'right' {
        if (position.y > window.innerHeight - Config.TOUCH_BRAKE_ZONE_RATIO * window.innerHeight) {
            return 'back';
        }
        if (position.x > window.innerWidth / 2) {
            return 'right';
        }
        return 'left';
    }
}
