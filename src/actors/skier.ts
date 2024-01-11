import { Actor, CollisionType, Engine, ParticleEmitter, vec } from "excalibur";
import { Config } from "../config";
import { Resources } from "../resources";
import { Race } from "../scenes/race";
import { ParticlesBuilder } from "../utils/particles-builder";

export class Skier extends Actor {
    public speed = 0;
    public skierName: string;

    public racing = true;
    private skierSprite = Resources.Skier.toSprite();
    private skierCarvingSprite = Resources.SkierCarving.toSprite();
    private skierSlidingSprite = Resources.SkierSliding.toSprite();
    private skierBrakingSprite = Resources.SkierBraking.toSprite();
    private particlesEmitter!: ParticleEmitter;

    constructor(skierName: string) {
        super({
            pos: vec(0, 0),
            width: 50,
            height: 50,
            z: 10,
            anchor: vec(0.5, 0.5),
            collisionType: CollisionType.Fixed
        });


        this.vel = vec(0, -30);

        this.skierName = skierName;
    }

    onInitialize() {
        this.graphics.add(this.skierSprite);
        (this.scene as Race).setupCamera();

        this.particlesEmitter = ParticlesBuilder.getParticlesEmitter();
        this.addChild(this.particlesEmitter);
    }

    update(engine: Engine): void {
        if (this.racing) {
            this.updateRotation(engine);
            this.updateSpeed(engine);
            this.updateVelocity(engine);
            this.updateCameraPosition();
            // this.updateSpeed(engine);

            this.emitParticles(engine);
        }

        /*
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

        this.emitParticles(engine);
        */
    }

    private updateRotation(engine: Engine): void {
        let rotationRate = 0;

        if (this.hasSlidingIntention(engine)) {
            rotationRate = Config.SLIDING_ROTATION_RATE / (180 / Math.PI);
        } else if (this.hasCarvingIntention(engine)) {
            rotationRate = Config.CARVING_ROTATION_RATE / (180 / Math.PI);
        }

        const futurRotation = this.hasLeftTurningIntention(engine) ? this.rotation - rotationRate : this.rotation + rotationRate;
        const normalizedRotation = futurRotation * (180 / Math.PI);

        if (normalizedRotation > 180 && normalizedRotation < 270) {
            this.rotation = Config.MAX_LEFT_ROTATION_ANGLE;
        } else if (normalizedRotation < 180 && normalizedRotation > 90) {
            this.rotation = Config.MAX_RIGHT_ROTATION_ANGLE;
        } else {
            this.rotation = futurRotation;
        }
    }

    private updateSpeed(engine: Engine): void {
        let angleOfSkier = this.rotation * (180 / Math.PI);
        if (angleOfSkier >= 270) {
            angleOfSkier = 360 - angleOfSkier;
        }


        let acceleration = (Config.ACCELERATION_RATE * Config.INITIAL_SLOPE);
        acceleration -= acceleration * angleOfSkier / 90;
        acceleration -= (Config.WIND_FRICTION_RATE * this.speed);
        if (this.hasSlidingIntention(engine)) {
            acceleration -= Config.SLIDING_BRAKING_RATE;
        } else if (this.hasCarvingIntention(engine)) {
            acceleration -= Config.CARVING_BRAKING_RATE;
        } else if (this.hasBreakingIntention(engine)) {
            acceleration -= Config.BRAKING_RATE;
        }

        const projectedSpeed = this.speed + acceleration;

        if (projectedSpeed < 0) {
            this.speed = 0;
        } else if (projectedSpeed > Config.MAX_SPEED) {
            this.speed = Config.MAX_SPEED;
        } else {
            this.speed = projectedSpeed;
        }
    }

    private updateVelocity(engine: Engine): void {
        let xVelocity = 0;
        let yVelocity = 0;
        const adherenceRate = this.getAdherenceRate(engine);
        const normalizedRotation = this.rotation * (180 / Math.PI);
        console.log(normalizedRotation);
        if (normalizedRotation === 0) {
            xVelocity = 0;
            yVelocity = this.speed;
        } else if (normalizedRotation <= 90) {
            const lateralVelocity = (normalizedRotation / 90) * this.speed * adherenceRate;
            xVelocity = lateralVelocity;
            yVelocity = this.speed - lateralVelocity;
        } else {
            const lateralVelocity = ((360 - normalizedRotation) / 90) * this.speed * adherenceRate;
            xVelocity = -lateralVelocity;
            yVelocity = this.speed - lateralVelocity;
        }
        this.vel = vec(xVelocity * Config.VELOCITY_MULTIPLIER_RATE, -yVelocity * Config.VELOCITY_MULTIPLIER_RATE);
    }

    private updateCameraPosition(): void {
        this.scene.camera.pos.y = this.pos.y - 200;
    }

    private getAdherenceRate(engine: Engine): number {
        let adherenceRate = 1;
        if (this.hasTurningIntention(engine)) {
            adherenceRate = this.hasSlidingIntention(engine) ? Config.SLIDING_ADHERENCE_RATE : Config.CARVING_ADHERENCE_RATE;
        }
        return adherenceRate;
    }

    private us(engine: Engine): void {
        let speedRate = 0
    }

    private emitParticles(engine: Engine): void {
        if (this.particlesEmitter) {
            const speedPercentage = this.speed / Config.MAX_SPEED;
            if (this.hasSlidingIntention(engine)) {
                this.particlesEmitter.pos.y = 5;
                this.particlesEmitter.radius = 6;
                this.particlesEmitter.particleLife = 1500;
                if (this.hasLeftSlidingIntention(engine)) {
                    this.particlesEmitter.maxAngle = 1.6;
                    this.particlesEmitter.minAngle = 0.5;
                    this.particlesEmitter.pos.x = 10;
                } else {
                    this.particlesEmitter.maxAngle = 2.6;
                    this.particlesEmitter.minAngle = 1.6;
                    this.particlesEmitter.pos.x = -10;
                }
                this.particlesEmitter.emitParticles(speedPercentage * 30);
            } else if (this.hasCarvingIntention(engine)) {
                this.particlesEmitter.pos.y = 5;
                this.particlesEmitter.radius = 1;
                this.particlesEmitter.particleLife = 450;
                this.particlesEmitter.maxAngle = 4.8;
                this.particlesEmitter.minAngle = 4.6;
                this.particlesEmitter.pos.x = this.hasLeftCarvingIntention(engine) ? 10 : -10;
                this.particlesEmitter.emitParticles(speedPercentage * 12);
            } else if (this.hasBreakingIntention(engine) || (!this.racing && this.speed > 0)) {
                this.particlesEmitter.pos.y = -20;
                this.particlesEmitter.radius = 6;
                this.particlesEmitter.particleLife = 1500;
                this.particlesEmitter.maxAngle = 6;
                this.particlesEmitter.minAngle = 3.4;
                this.particlesEmitter.pos.x = 0
                this.particlesEmitter.emitParticles(speedPercentage * 50);
            } else if (this.speed > 0) {
                this.particlesEmitter.pos.y = 0;
                this.particlesEmitter.radius = 3;
                this.particlesEmitter.particleLife = 500;
                this.particlesEmitter.maxAngle = 6;
                this.particlesEmitter.minAngle = 3.4;
                this.particlesEmitter.pos.x = 0
                this.particlesEmitter.emitParticles(speedPercentage * 5);
            }
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

    /*
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
    */

    private getVelocityAngle(lateralVelocity: number): number {
        return Math.floor(lateralVelocity / Math.PI) * Config.CARVING_VISUAL_VELOCITY_ANGLE_MULTIPLIER;
    }

    /*
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
    */

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

    private hasLeftTurningIntention(engine: Engine): boolean {
        return this.hasLeftCarvingIntention(engine) || this.hasLeftSlidingIntention(engine);
    }

    private hasRightTurningIntention(engine: Engine): boolean {
        return this.hasRightCarvingIntention(engine) || this.hasRightSlidingIntention(engine);
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
