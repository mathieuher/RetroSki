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
            width: 30,
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
            this.updateGraphics(engine);
            this.updateCameraPosition();
            this.emitParticles(engine);
        }
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
            const lateralVelocity = (normalizedRotation / 90) * this.speed;
            xVelocity = lateralVelocity * 1.15;
            yVelocity = Math.max(0, this.speed - (adherenceRate * lateralVelocity));
        } else {
            const lateralVelocity = ((360 - normalizedRotation) / 90) * this.speed;
            xVelocity = -lateralVelocity * 1.15;
            yVelocity = Math.max(0, this.speed - (adherenceRate * lateralVelocity));
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

    private updateGraphics(engine: Engine): void {
        if (this.hasSlidingIntention(engine)) {
            this.graphics.use(this.skierSlidingSprite);
            this.graphics.flipHorizontal = this.hasLeftSlidingIntention(engine);
        } else if (this.hasBreakingIntention(engine)) {
            this.graphics.use(this.skierBrakingSprite);
        } else if (this.hasCarvingIntention(engine)) {
            this.graphics.use(this.skierCarvingSprite);
            this.graphics.flipHorizontal = this.hasLeftCarvingIntention(engine);
        } else {
            this.graphics.use(this.skierSprite);
        }
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
                    this.particlesEmitter.pos.x = 12;
                } else {
                    this.particlesEmitter.maxAngle = 2.6;
                    this.particlesEmitter.minAngle = 1.6;
                    this.particlesEmitter.pos.x = -12;
                }
                this.particlesEmitter.emitParticles(speedPercentage * 30);
            } else if (this.hasCarvingIntention(engine)) {
                this.particlesEmitter.pos.y = 5;
                this.particlesEmitter.radius = 1;
                this.particlesEmitter.particleLife = 450;
                this.particlesEmitter.maxAngle = 4.8;
                this.particlesEmitter.minAngle = 4.6;
                this.particlesEmitter.pos.x = this.hasLeftCarvingIntention(engine) ? 12 : -12;
                this.particlesEmitter.emitParticles(speedPercentage * 15);
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
