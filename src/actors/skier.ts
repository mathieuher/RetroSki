import { Actor, CollisionType, Engine, vec } from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources";
import { Race } from "../scenes/race";

export class Skier extends Actor {
    public speed = 0;

    public racing = true;
    private skierSprite = Resources.Skier.toSprite();
    private skierCarvingSprite = Resources.SkierCarving.toSprite();
    private skierSlidingSprite = Resources.SkierSliding.toSprite();
    private skierBrakingSprite = Resources.SkierBraking.toSprite();

    constructor() {
        super({
            pos: vec(0, 0),
            width: 50,
            height: 50,
            z: 10,
            anchor: vec(0.5, 0.5),
            collisionType: CollisionType.Fixed
        });
    }

    onInitialize() {
        this.graphics.add(this.skierSprite);
        (this.scene as Race).setupCamera();
    }

    update(engine: Engine): void {
        if (this.racing) {
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
                if (this.hasBreakingIntention(engine)) {
                    this.updateSpeed('braking');
                    this.graphics.use(this.skierBrakingSprite);
                } else {
                    this.updateSpeed('standard');
                    this.graphics.use(this.skierSprite);
                }
                this.reduceTurning();
            }

            this.updateDirection(engine);

        } else {
            this.updateSpeed('braking');
            this.graphics.use(this.skierBrakingSprite);
            this.reduceTurning();
        }
    }

    private updateDirection(engine: Engine): void {
        if (this.hasSlidingIntention(engine)) {
            const slidingAngle = Config.SLIDING_MAX_VISUAL_ANGLE / 360;
            this.rotation = this.hasLeftSlidingIntention(engine) ? -slidingAngle : slidingAngle;
        } else {
            this.rotation = this.getVelocityAngle(this.vel.x) / 360;;
        }
    }

    private isSlowSpeeding(): boolean {
        return this.speed < Config.SLOW_SPEED_LIMIT;
    }

    private updateSpeed(action: 'standard' | 'braking' | 'sliding' | 'carving'): void {
        switch (action) {
            case 'standard':
                this.speed = Math.min(Config.MAX_SPEED, this.speed + (this.isSlowSpeeding() ? Config.ACCELERATION_RATE_WHEN_SLOW_SPEEDING * Config.ACCELERATION_RATE_ON_STANDARD_SLOPE : Config.ACCELERATION_RATE_ON_STANDARD_SLOPE));
                break;
            case 'braking':
                this.speed = Math.max(0, this.speed + Config.BRAKING_ACCELERATION_RATE);
                break;
            case 'sliding':
                this.speed = Math.max(0, this.speed + Config.SLIDING_ACCELERATION_RATE);
                break;
            case 'carving':
                this.speed = Math.min(Config.MAX_SPEED, this.speed + (this.isSlowSpeeding() ? Config.ACCELERATION_RATE_WHEN_SLOW_SPEEDING * Config.CARVING_ACCELERATION_RATE : Config.CARVING_ACCELERATION_RATE));
                break;
            default:
                this.speed = this.speed;
        }

        this.vel.y = -this.speed * Config.SPEED_VISUAL_RATE;
        this.scene.camera.pos.y = this.pos.y - 200;
    }

    private getVelocityAngle(lateralVelocity: number): number {
        return Math.floor(lateralVelocity / Math.PI) * Config.CARVING_VISUAL_VELOCITY_ANGLE_MULTIPLIER;
    }

    private carving(orientation: 'left' | 'right'): void {
        if (orientation === 'left' && this.canIncreaseTurningLeft()) {
            this.vel.x -= this.isMovingRight() ? Config.CARVING_INVERTER_VELOCITY : Config.CARVING_LATERAL_VELOCITY;
        } else if (orientation === 'right' && this.canIncreaseTurningRight()) {
            this.vel.x += this.isMovingLeft() ? Config.CARVING_INVERTER_VELOCITY : Config.CARVING_LATERAL_VELOCITY;
        }

        this.updateSpeed('carving');
    }

    private sliding(orientation: 'left' | 'right'): void {
        if (orientation === 'left' && this.canIncreaseTurningLeft()) {
            this.vel.x -= this.isMovingRight() ? Config.SLIDING_INVERTER_VELOCITY : Config.SLIDING_LATERAL_VELOCITY;
        } else if (orientation === 'right' && this.canIncreaseTurningRight()) {
            this.vel.x += this.isMovingLeft() ? Config.SLIDING_INVERTER_VELOCITY : Config.SLIDING_LATERAL_VELOCITY;
        }

        this.updateSpeed('sliding');
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

    private hasBreakingIntention(engine: Engine): boolean {
        return engine.input.keyboard.isHeld(Config.CONTROL_BRAKE);
    }

    private hasCarvingIntention(engine: Engine): boolean {
        return this.hasLeftCarvingIntention(engine) || this.hasRightCarvingIntention(engine);
    }

    private hasSlidingIntention(engine: Engine): boolean {
        return this.hasLeftSlidingIntention(engine) || this.hasRightSlidingIntention(engine);
    }

    private hasLeftSlidingIntention(engine: Engine): boolean {
        return this.hasLeftCarvingIntention(engine) && this.hasBreakingIntention(engine);
    }

    private hasRightSlidingIntention(engine: Engine): boolean {
        return this.hasRightCarvingIntention(engine) && this.hasBreakingIntention(engine);
    }

    private hasLeftCarvingIntention(engine: Engine): boolean {
        return engine.input.keyboard.isHeld(Config.CONTROL_CARVE_LEFT);
    }

    private hasRightCarvingIntention(engine: Engine): boolean {
        return engine.input.keyboard.isHeld(Config.CONTROL_CARVE_RIGHT);
    }

    private hasTurningIntention(engine: Engine): boolean {
        return this.hasSlidingIntention(engine) || this.hasCarvingIntention(engine);
    }
}
