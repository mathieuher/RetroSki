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
            console.log(this.engine.input.pointers.count());
            this.recomputeTouchStatus('up', event.pagePos);
        });
    }

    private recomputeTouchStatus(type: 'down' | 'up', position: Vector): void {
        if(this.engine.input.pointers.count() === 1) {
            this.resetTouch();
        }
        
        if (this.getTouchZone(position) === 'back') {
            this.isTouchingBack = type === 'down';
        } else if (this.getTouchZone(position) === 'left') {
            this.isTouchingLeft = type === 'down';
        } else if (this.getTouchZone(position) === 'right') {
            this.isTouchingRight = type === 'down';
        }
        this.isTouching = this.isTouchingBack || this.isTouchingLeft || this.isTouchingRight;
    }

    private resetTouch(): void {
        this.isTouchingBack = false;
        this.isTouchingLeft = false;
        this.isTouchingRight = false;
        this.isTouching = false;
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
