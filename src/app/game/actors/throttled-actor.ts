import { Actor, type Engine, type ActorArgs } from 'excalibur';

export class ThrottledActor extends Actor {
    private updateLoop = 0;
    private throttleRatio = 1;
    protected throttledUpdate(engine: Engine, delta: number): void {}

    constructor(throttleRatio: number, config?: ActorArgs) {
        super(config);
        this.throttleRatio = throttleRatio;
    }

    public override update(engine: Engine, delta: number): void {
        this.updateLoop++;
        if (this.updateLoop === this.throttleRatio) {
            this.updateLoop = 0;
            this.throttledUpdate(engine, delta);
        }
    }
}
