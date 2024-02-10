import { Engine, Vector } from "excalibur";
import { Config } from "../config";

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
        this.engine.input.pointers.on('down', (event) => {
            this.recomputeTouchStatus('down', event.screenPos);
        });

        this.engine.input.pointers.on('up', (event) => {
            this.recomputeTouchStatus('up', event.screenPos);
        });
    }

    private recomputeTouchStatus(type: 'down' | 'up', position: Vector): void {
        if (this.getTouchZone(position) === 'back') {
            this.isTouchingBack = type === 'down';
        } else if (this.getTouchZone(position) === 'left') {
            this.isTouchingLeft = type === 'down';
        } else if (this.getTouchZone(position) === 'right') {
            this.isTouchingRight = type === 'down';
        }
        this.isTouching = this.isTouchingBack || this.isTouchingLeft || this.isTouchingRight;
    }

    private getTouchZone(position: Vector): 'back' | 'left' | 'right' {
        if (position.y > Config.DISPLAY_HEIGHT - Config.TOUCH_BRAKE_ZONE_HEIGHT) {
            return 'back';
        }
        if (position.x > Config.DISPLAY_WIDTH / 2) {
            return 'right';
        }
        return 'left';
    }



}