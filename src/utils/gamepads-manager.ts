import { Axes, Buttons, Engine, Gamepad } from "excalibur";
import { Config } from "../config";

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

    public isButtonPressed(button: Buttons, gamepad?: Gamepad): boolean {
        gamepad = gamepad || this.getFirstGamepad();
        return gamepad.wasButtonPressed(button);
    }

    public isAxesUsed(axes: Axes, gamepad?: Gamepad): boolean {
        gamepad = gamepad || this.getFirstGamepad();
        return Math.abs(gamepad.getAxes(axes)) > Config.GAMEPAD_AXES_FILTER_RATE;
    }

    public getAxes(axes: Axes, gamepad?: Gamepad): number {
        gamepad = gamepad || this.getFirstGamepad();
        const axesValue = gamepad.getAxes(axes);
        return Math.abs(axesValue) > Config.GAMEPAD_AXES_FILTER_RATE ? axesValue : 0;
    }

    private initGamepads(): void {
        this.engine.input.gamepads.setMinimumGamepadConfiguration({ axis: 2, buttons: 4 });
        this.engine.input.gamepads.enabled = true;
    }

}