import { Actor, Color, Engine, Keys, Text, vec } from "excalibur";
import { Config } from "./config";
import { Resources } from "./resources";

export class Player extends Actor {
    public speed = 0;
    public velocityLabel = new Text(
        {
            text: `${this.vel.x}`
        }
    );

    private skierSprite = Resources.Skier.toSprite();
    private skierCarvingSprite = Resources.SkierCarving.toSprite();
    private skierSlidingSprite = Resources.SkierSliding.toSprite();

    constructor(engine: Engine) {
        super({
            pos: engine.worldToScreenCoordinates(vec(0, 0)),
            width: 50,
            height: 50,
            anchor: vec(0.5, 0.5)
        });
    }

    onInitialize() {
        this.graphics.add(Resources.Skier.toSprite());
        // this.graphics.offset = vec(0, 25);
        //this.graphics.add(this.velocityLabel);
    }

    update(engine: Engine, delta: number): void {
        // Position
        if (this.hasTurningIntention(engine)) {
            this.graphics.use(this.hasSlidingIntention(engine) ? this.skierSlidingSprite : this.skierCarvingSprite);
            this.graphics.flipHorizontal = this.hasLeftSlidingIntention(engine) || this.hasLeftCarvingIntention(engine);
            if (this.hasLeftSlidingIntention(engine)) {
                this.sliding('left');
            } else if (this.hasRightSlidingIntention(engine)) {
                this.sliding('right');
            } else if (this.hasLeftCarvingIntention(engine)) {
                this.carving('left');
            } else if (this.hasRightCarvingIntention(engine)) {
                this.carving('right');
            }
        } else {
            this.graphics.use(this.skierSprite);
            this.reduceTurning();
        }

        this.velocityLabel.text = `Angle : ${this.getVelocityAngle(this.vel.x)}`;
        this.updateDirection(engine);
    }

    private updateDirection(engine: Engine): void {
        if (this.hasSlidingIntention(engine)) {
            const slidingAngle = Config.SLIDING_MAX_VISUAL_ANGLE / 360;
            this.rotation = this.hasLeftSlidingIntention(engine) ? -slidingAngle : slidingAngle;
            console.log(this.rotation);
        } else {
            this.rotation = this.getVelocityAngle(this.vel.x) / 360;;
        }
    }

    private getVelocityAngle(lateralVelocity: number): number {
        return Math.floor(lateralVelocity / Math.PI);
    }

    private carving(orientation: 'left' | 'right'): void {
        if (orientation === 'left' && this.canIncreaseTurningLeft()) {
            this.vel.x -= this.isMovingRight() ? Config.CARVING_INVERTER_VELOCITY : Config.CARVING_LATERAL_VELOCITY;
        } else if (orientation === 'right' && this.canIncreaseTurningRight()) {
            this.vel.x += this.isMovingLeft() ? Config.CARVING_INVERTER_VELOCITY : Config.CARVING_LATERAL_VELOCITY;
        }
    }

    private sliding(orientation: 'left' | 'right'): void {
        if (orientation === 'left' && this.canIncreaseTurningLeft()) {
            this.vel.x -= this.isMovingRight() ? Config.SLIDING_INVERTER_VELOCITY : Config.SLIDING_LATERAL_VELOCITY;
        } else if (orientation === 'right' && this.canIncreaseTurningRight()) {
            this.vel.x += this.isMovingLeft() ? Config.SLIDING_INVERTER_VELOCITY : Config.SLIDING_LATERAL_VELOCITY;
        }
    }

    private canIncreaseTurningLeft(): boolean {
        return this.vel.x > -Config.CARVING_MAX_LATERAL_VELOCITY;
    }

    private canIncreaseTurningRight(): boolean {
        return this.vel.x < Config.CARVING_MAX_LATERAL_VELOCITY;
    }

    private reduceTurning(): void {
        if (this.vel.x > -Config.CARVING_INVERTER_VELOCITY && this.vel.x < Config.CARVING_INVERTER_VELOCITY) {
            this.vel.x = 0;
        } else {
            this.vel.x = this.isMovingRight() ? this.vel.x - Config.CARVING_INVERTER_VELOCITY : this.vel.x + Config.CARVING_INVERTER_VELOCITY;
        }
    }

    private isMovingLeft(): boolean {
        return this.vel.x < 0;
    }

    private isMovingRight(): boolean {
        return this.vel.x > 0;
    }

    private isMovingStraight(): boolean {
        return this.vel.x === 0;
    }

    private hasCarvingIntention(engine: Engine): boolean {
        return this.hasLeftCarvingIntention(engine) || this.hasRightCarvingIntention(engine);
    }

    private hasSlidingIntention(engine: Engine): boolean {
        return this.hasLeftSlidingIntention(engine) || this.hasRightSlidingIntention(engine);
    }

    private hasLeftSlidingIntention(engine: Engine): boolean {
        return this.hasLeftCarvingIntention(engine) && engine.input.keyboard.isHeld(Keys.Space);
    }

    private hasRightSlidingIntention(engine: Engine): boolean {
        return this.hasRightCarvingIntention(engine) && engine.input.keyboard.isHeld(Keys.Space);
    }

    private hasLeftCarvingIntention(engine: Engine): boolean {
        return engine.input.keyboard.isHeld(Keys.ArrowLeft);
    }

    private hasRightCarvingIntention(engine: Engine): boolean {
        return engine.input.keyboard.isHeld(Keys.ArrowRight);
    }

    private hasTurningIntention(engine: Engine): boolean {
        return this.hasSlidingIntention(engine) || this.hasCarvingIntention(engine);
    }
}
