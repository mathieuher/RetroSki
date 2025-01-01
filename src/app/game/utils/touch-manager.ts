import type { Engine, GlobalCoordinates, Vector } from 'excalibur';
import { Config } from '../config';

export class TouchManager {
    private engine: Engine;

    public isTouching = false;

    constructor(engine: Engine) {
        this.engine = engine;
        this.listenTouch();
    }

    public get isTouchingBack(): boolean {
        const value = Array.from(this.engine.input.pointers.currentFramePointerCoords).findIndex(
            v => v[1].pagePos.y > window.innerHeight - Config.TOUCH_BRAKE_ZONE_RATIO * window.innerHeight
        );
        return value > -1;
    }

    public get isTouchingRight(): boolean {
        const value = Array.from(this.engine.input.pointers.currentFramePointerCoords).findIndex(v => {
            return (
                v[1].pagePos.y < window.innerHeight - Config.TOUCH_BRAKE_ZONE_RATIO * window.innerHeight &&
                v[1].pagePos.x > window.innerWidth / 2
            );
        });
        return value > -1;
    }

    public get isTouchingLeft(): boolean {
        const value = Array.from(this.engine.input.pointers.currentFramePointerCoords).findIndex(v => {
            return (
                v[1].pagePos.y < window.innerHeight - Config.TOUCH_BRAKE_ZONE_RATIO * window.innerHeight &&
                v[1].pagePos.x < window.innerWidth / 2
            );
        });
        return value > -1;
    }

    private listenTouch(): void {
        this.engine.input.pointers.on('down', event => {
            if (this.engine.input.pointers.count() > 2) {
                this.engine.input.pointers.clear();
            }
            this.recomputeTouchStatus('down', event.pagePos);
        });

        this.engine.input.pointers.on('up', event => {
            this.recomputeTouchStatus('up', event.pagePos);
        });
    }

    private recomputeTouchStatus(type: 'down' | 'up', position: Vector): void {
        if (this.getTouchZone(position) === 'back') {
            // this.isTouchingBack = type === 'down';
        } else if (this.getTouchZone(position) === 'left') {
            // this.isTouchingLeft = type === 'down';
        } else if (this.getTouchZone(position) === 'right') {
            // this.isTouchingRight = type === 'down';
        }
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
