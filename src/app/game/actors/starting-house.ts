import { toRadians, vec } from 'excalibur';
import { Resources } from '../resources';
import { StartingGate } from './starting-gate';
import { ScreenManager } from '../utils/screen-manager';
import { ThrottledActor } from './throttled-actor';
import { Config } from '../config';

export class StartingHouse extends ThrottledActor {
    private gate: StartingGate;

    constructor() {
        super(Config.THROTTLING_STARTING_HOUSE, {
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

    public openGate(): void {
        this.gate.rotation = toRadians(90);
    }

    protected override throttledUpdate(): void {
        if (this.canDestroy()) {
            this.kill();
        }
    }

    private canDestroy(): boolean {
        return !ScreenManager.isNearScreen(this, this.scene!.camera);
    }
}
