import { Actor, toRadians, vec } from "excalibur";
import { Resources } from "../resources";
import { StartingGate } from "./starting-gate";
import { Config } from "../config";

export class StartingHouse extends Actor {
    private gate: StartingGate;

    constructor() {
        super({
            anchor: vec(0.5, 0),
            pos: vec(0, -10),
            width: 240,
            height: 180,
            z: 11
        });

        this.graphics.use(Resources.StartingHouse.toSprite());
        this.gate = new StartingGate(vec(0.5, 0), vec(14, -1.5));
        this.addChild(this.gate);
    }

    public update(): void {
        if (this.canDestroy()) {
            this.kill();
        }
    }

    public openGate(): void {
        this.gate.rotation = toRadians(90);
    }

    private canDestroy(): boolean {
        return this.scene.camera.y - this.pos.y < - Config.DISPLAY_HEIGHT * Config.VISIBLE_ON_SCREEN_MARGIN_FACTOR;
    }
}
