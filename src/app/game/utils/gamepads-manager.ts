import type { Axes, Buttons, Engine, Gamepad } from 'excalibur';
import { Config } from '../config';

export class GamepadsManager {
    private engine: Engine;

    constructor(engine: Engine) {
        this.engine = engine;
        this.initGamepads();
    }

    public getConnectedGamepads(): Gamepad[] {
        return this.engine.input.gamepads.getValidGamepads().filter(gamepad => gamepad.connected);
    }

    public getFirstGamepad(): Gamepad {
        return this.engine.input.gamepads.at(0);
    }

    public isButtonHeld(button: Buttons, gamepad?: Gamepad): boolean {
        const pad = gamepad || this.getFirstGamepad();
        return pad.isButtonHeld(button);
    }

    public wasButtonPressed(button: Buttons, gamepad?: Gamepad): boolean {
        const pad = gamepad || this.getFirstGamepad();
        return pad.wasButtonPressed(button);
    }

    public isAxesUsed(axes: Axes, gamepad?: Gamepad): boolean {
        const pad = gamepad || this.getFirstGamepad();
        return Math.abs(pad.getAxes(axes)) > Config.GAMEPAD_AXES_FILTER_RATE;
    }

    public getAxes(axes: Axes, gamepad?: Gamepad): number {
        const pad = gamepad || this.getFirstGamepad();
        const axesValue = pad.getAxes(axes);
        return Math.abs(axesValue) > Config.GAMEPAD_AXES_FILTER_RATE ? axesValue : 0;
    }

    private initGamepads(): void {
        this.engine.input.gamepads.setMinimumGamepadConfiguration({ axis: 2, buttons: 4 });
        this.engine.input.gamepads.enabled = true;
    }
}
