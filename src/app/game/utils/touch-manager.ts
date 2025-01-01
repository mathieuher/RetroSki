import type { Engine, Vector } from 'excalibur';
import { Config } from '../config';

export class TouchManager {
    private engine: Engine;

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
            this.recomputeTouchStatus('down', event.pagePos);
        });

        this.engine.input.pointers.on('up', event => {
            this.recomputeTouchStatus('up', event.pagePos);
        });
    }

    private recomputeTouchStatus(type: 'down' | 'up', position: Vector): void {
        if (this.getTouchZone(position) === 'back') {
            if (!this.isTouchingBack && type === 'up') {
                this.resetTouching();
            }
            this.isTouchingBack = type === 'down';
        } else if (this.getTouchZone(position) === 'left') {
            if (!this.isTouchingLeft && type === 'up') {
                this.resetTouching();
            }
            this.isTouchingLeft = type === 'down';
        } else if (this.getTouchZone(position) === 'right') {
            if (!this.isTouchingRight && type === 'up') {
                this.resetTouching();
            }
            this.isTouchingRight = type === 'down';
        }
        this.isTouching = this.isTouchingBack || this.isTouchingLeft || this.isTouchingRight;
    }

    private resetTouching(): void {
        this.isTouchingBack = false;
        this.isTouchingLeft = false;
        this.isTouchingRight = false;
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
