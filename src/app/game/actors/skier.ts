import { Actor, CollisionType, type Engine, type ParticleEmitter, vec } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import type { Race } from '../scenes/race';
import { ParticlesBuilder } from '../utils/particles-builder';
import type { SkierConfig } from '../models/skier-config';
import type { Game } from '../game';
import { SkierActions } from '../models/skier-actions.enum';
import { SkierGraphics } from '../utils/skier-graphics';

export class Skier extends Actor {
    public speed = 0;
    public skierName: string;
    public skierConfig: SkierConfig;

    public racing = false;
    public finish = false;

    private particlesEmitter!: ParticleEmitter;

    constructor(skierName: string, skierConfig: SkierConfig) {
        super({
            pos: vec(0, 0),
            width: 21,
            height: 30,
            z: 4,
            anchor: vec(0.5, 0.5),
            collisionType: CollisionType.Fixed
        });
        this.skierName = skierName;
        this.skierConfig = skierConfig;
    }

    override onInitialize() {
        this.particlesEmitter = ParticlesBuilder.getParticlesEmitter();
        this.addChild(this.particlesEmitter);
    }

    override update(engine: Engine): void {
        const skierAction = this.getSkierCurrentAction(engine);
        this.updateGraphics(skierAction);
        if (this.racing || this.finish) {
            this.updateRotation(engine);
            this.updateSpeed(skierAction, engine);
            this.updateVelocity(engine);
        } else {
            if (
                engine.input.keyboard.wasPressed(Config.KEYBOARD_START_KEY) ||
                (engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_RACE_BUTTON) ||
                (this.scene as Race).touchManager.isTouching
            ) {
                (this.scene as Race).startRace();
            }
        }
        this.emitParticles(engine, skierAction);
        this.emitSounds(engine as Game, this.finish);
    }

    public finishRace(): void {
        this.racing = false;
        this.finish = true;
    }

    public startRace(): void {
        this.racing = true;
        (this.scene.engine as Game).soundPlayer.playSound(Resources.TurningSound, 0, true, false);
    }

    public getSkierCurrentAction(engine: Engine): SkierActions {
        if (this.racing) {
            if (this.slidingIntention(engine)) {
                return this.leftSlidingIntention(engine) ? SkierActions.SLIDE_LEFT : SkierActions.SLIDE_RIGHT;
            }
            if (this.hasBreakingIntention(engine)) {
                return SkierActions.BRAKE;
            }
            if (this.carvingIntention(engine)) {
                return this.leftCarvingIntention(engine) ? SkierActions.CARVE_LEFT : SkierActions.CARVE_RIGHT;
            }
            return SkierActions.NOTHING;
        }
        return SkierActions.BRAKE;
    }

    private updateRotation(engine: Engine): void {
        let rotationRate = 0;
        let futurRotation = 0;

        if (this.hasTurningIntention(engine)) {
            if (this.slidingIntention(engine)) {
                const rotationSpeedMultiplier =
                    this.speed < this.skierConfig.slidingOptimalSpeed
                        ? Math.max(this.speed, 1) / this.skierConfig.slidingOptimalSpeed
                        : 1;
                rotationRate =
                    (this.skierConfig.slidingRotationRate / (180 / Math.PI)) *
                    rotationSpeedMultiplier *
                    this.slidingIntention(engine);
            } else if (this.carvingIntention(engine)) {
                const rotationSpeedMultiplier =
                    this.speed < this.skierConfig.carvingOptimalSpeed
                        ? Math.max(this.speed, 1) / this.skierConfig.carvingOptimalSpeed
                        : 1;
                rotationRate =
                    (this.skierConfig.carvingRotationRate / (180 / Math.PI)) *
                    rotationSpeedMultiplier *
                    this.carvingIntention(engine);
            }
            futurRotation = this.hasLeftTurningIntention(engine)
                ? this.rotation - rotationRate
                : this.rotation + rotationRate;
        } else {
            const rotationCenterRate = Config.ROTATION_RECENTER_RATE / (180 / Math.PI);
            const angularRotation = this.rotation * (180 / Math.PI);
            if (angularRotation !== 0) {
                futurRotation =
                    angularRotation >= 270 ? this.rotation + rotationCenterRate : this.rotation - rotationCenterRate;
            }
        }

        const normalizedRotation = futurRotation * (180 / Math.PI);

        if (normalizedRotation > 180 && normalizedRotation < 270) {
            this.rotation = Config.MAX_LEFT_ROTATION_ANGLE;
        } else if (normalizedRotation < 180 && normalizedRotation > 90) {
            this.rotation = Config.MAX_RIGHT_ROTATION_ANGLE;
        } else {
            this.rotation = futurRotation;
        }
    }

    private updateSpeed(skierAction: SkierActions, engine: Engine): void {
        let angleOfSkier = this.rotation * (180 / Math.PI);
        if (angleOfSkier >= 270) {
            angleOfSkier = 360 - angleOfSkier;
        }

        let acceleration = Config.ACCELERATION_RATE * Config.INITIAL_SLOPE;
        acceleration -= (acceleration * angleOfSkier) / 90;
        acceleration -= this.skierConfig.windFrictionRate * this.speed;
        if (skierAction === SkierActions.SLIDE_LEFT || skierAction === SkierActions.SLIDE_RIGHT) {
            acceleration -= Config.SLIDING_BRAKING_RATE * this.slidingIntention(engine);
        } else if (skierAction === SkierActions.CARVE_LEFT || skierAction === SkierActions.CARVE_RIGHT) {
            acceleration -= Config.CARVING_BRAKING_RATE * this.carvingIntention(engine);
        } else if (skierAction === SkierActions.BRAKE) {
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
        if (normalizedRotation === 0) {
            xVelocity = 0;
            yVelocity = this.speed;
        } else if (normalizedRotation <= 90) {
            const lateralVelocity = (normalizedRotation / 90) * this.speed;
            xVelocity = lateralVelocity * Config.LATERAL_VELOCITY_ROTATION_RATE * adherenceRate;
            yVelocity = Math.max(0, this.speed - adherenceRate * lateralVelocity);
        } else {
            const lateralVelocity = ((360 - normalizedRotation) / 90) * this.speed;
            xVelocity = -lateralVelocity * Config.LATERAL_VELOCITY_ROTATION_RATE * adherenceRate;
            yVelocity = Math.max(0, this.speed - adherenceRate * lateralVelocity);
        }
        this.vel = vec(xVelocity * Config.VELOCITY_MULTIPLIER_RATE, -yVelocity * Config.VELOCITY_MULTIPLIER_RATE);
    }

    private getAdherenceRate(engine: Engine): number {
        let adherenceRate = 1;
        if (this.hasTurningIntention(engine)) {
            adherenceRate = this.slidingIntention(engine)
                ? Config.SLIDING_ADHERENCE_RATE
                : Config.CARVING_ADHERENCE_RATE;
        }
        return adherenceRate;
    }

    private updateGraphics(currentAction: SkierActions): void {
        const graphic = SkierGraphics.getSpriteForAction('skier', currentAction);
        this.graphics.use(graphic.sprite);
        this.graphics.flipHorizontal = !!graphic.flipHorizontal;
    }

    private emitSounds(engine: Game, forceBreaking: boolean): void {
        if ((this.hasBreakingIntention(engine) || forceBreaking) && this.speed) {
            Resources.TurningSound.volume = Math.min(
                Config.BRAKING_SOUND_VOLUME,
                (this.speed / Config.MAX_SPEED) * Config.BRAKING_SOUND_VOLUME
            );
        } else if (this.carvingIntention(engine) && this.speed) {
            Resources.TurningSound.volume = Math.min(
                Config.CARVING_SOUND_VOLUME,
                (this.speed / Config.MAX_SPEED) * Config.CARVING_SOUND_VOLUME * this.carvingIntention(engine)
            );
        } else {
            Resources.TurningSound.volume = 0;
        }
    }

    private emitParticles(engine: Engine, skierAction: SkierActions): void {
        if (this.particlesEmitter) {
            const speedPercentage = this.speed / Config.MAX_SPEED;
            if (skierAction === SkierActions.SLIDE_LEFT || skierAction === SkierActions.SLIDE_RIGHT) {
                this.emitSlidingParticles(speedPercentage, this.slidingIntention(engine), skierAction);
            } else if (skierAction === SkierActions.CARVE_LEFT || skierAction === SkierActions.CARVE_RIGHT) {
                this.emitCarvingParticles(speedPercentage, this.carvingIntention(engine), skierAction);
            } else if (skierAction === SkierActions.BRAKE) {
                this.emitBrakingParticles(speedPercentage);
            } else if (this.speed > 0) {
                this.emitRidingParticles(speedPercentage);
            }
        }
    }

    private emitSlidingParticles(speedPercentage: number, slidingIntensity: number, skierAction: SkierActions): void {
        this.particlesEmitter.pos.y = 2.5;
        this.particlesEmitter.radius = 6;
        this.particlesEmitter.particleLife = 1500;
        if (skierAction === SkierActions.SLIDE_LEFT) {
            this.particlesEmitter.maxAngle = 1.6;
            this.particlesEmitter.minAngle = 0.5;
            this.particlesEmitter.pos.x = 8;
        } else {
            this.particlesEmitter.maxAngle = 2.6;
            this.particlesEmitter.minAngle = 1.6;
            this.particlesEmitter.pos.x = -8;
        }
        this.particlesEmitter.emitParticles(speedPercentage * slidingIntensity * 35);
    }

    private emitCarvingParticles(speedPercentage: number, carvingIntensity: number, skierAction: SkierActions): void {
        this.particlesEmitter.pos.y = 2.5;
        this.particlesEmitter.radius = 1;
        this.particlesEmitter.particleLife = 450;
        this.particlesEmitter.maxAngle = 4.8;
        this.particlesEmitter.minAngle = 4.6;
        this.particlesEmitter.pos.x = skierAction === SkierActions.CARVE_LEFT ? 8 : -8;
        this.particlesEmitter.emitParticles(speedPercentage * carvingIntensity * 25);
    }

    private emitBrakingParticles(speedPercentage: number): void {
        this.particlesEmitter.pos.y = -10;
        this.particlesEmitter.radius = 6;
        this.particlesEmitter.particleLife = 1500;
        this.particlesEmitter.maxAngle = 6;
        this.particlesEmitter.minAngle = 3.4;
        this.particlesEmitter.pos.x = 0;
        this.particlesEmitter.emitParticles(speedPercentage * 25);
    }

    private emitRidingParticles(speedPercentage: number): void {
        this.particlesEmitter.pos.y = 0;
        this.particlesEmitter.radius = 3;
        this.particlesEmitter.particleLife = 500;
        this.particlesEmitter.maxAngle = 6;
        this.particlesEmitter.minAngle = 3.4;
        this.particlesEmitter.pos.x = 0;
        this.particlesEmitter.emitParticles(speedPercentage * 10);
    }

    private hasBreakingIntention(engine: Engine): boolean {
        return (
            engine.input.keyboard.isHeld(Config.KEYBOARD_CONTROL_BRAKE) ||
            (engine as Game).gamepadsManager.isButtonHeld(Config.GAMEPAD_CONTROL_BRAKE) ||
            (this.scene as Race).touchManager.isTouchingBack
        );
    }

    private carvingIntention(engine: Engine): number {
        return Math.min(1, this.leftCarvingIntention(engine) + this.rightCarvingIntention(engine));
    }

    private slidingIntention(engine: Engine): number {
        return Math.min(1, this.leftSlidingIntention(engine) + this.rightSlidingIntention(engine));
    }

    private hasLeftTurningIntention(engine: Engine): boolean {
        return this.leftCarvingIntention(engine) + this.leftSlidingIntention(engine) > 0;
    }

    private leftSlidingIntention(engine: Engine): number {
        return this.hasBreakingIntention(engine) && this.leftCarvingIntention(engine) > 0
            ? this.leftCarvingIntention(engine)
            : 0;
    }

    private rightSlidingIntention(engine: Engine): number {
        return this.hasBreakingIntention(engine) && this.rightCarvingIntention(engine) > 0
            ? this.rightCarvingIntention(engine)
            : 0;
    }

    private leftCarvingIntention(engine: Engine): number {
        if (
            engine.input.keyboard.isHeld(Config.KEYBOARD_CONTROL_CARVE_LEFT) ||
            (this.scene as Race).touchManager.isTouchingLeft
        ) {
            return 1;
        }
        if ((engine as Game).gamepadsManager.getAxes(Config.GAMEPAD_CONTROL_CARVE) < 0) {
            return Math.abs((engine as Game).gamepadsManager.getAxes(Config.GAMEPAD_CONTROL_CARVE));
        }
        return 0;
    }

    private rightCarvingIntention(engine: Engine): number {
        if (
            engine.input.keyboard.isHeld(Config.KEYBOARD_CONTROL_CARVE_RIGHT) ||
            (this.scene as Race).touchManager.isTouchingRight
        ) {
            return 1;
        }
        if ((engine as Game).gamepadsManager.getAxes(Config.GAMEPAD_CONTROL_CARVE) > 0) {
            return (engine as Game).gamepadsManager.getAxes(Config.GAMEPAD_CONTROL_CARVE);
        }
        return 0;
    }

    private hasTurningIntention(engine: Engine): boolean {
        return this.carvingIntention(engine) > 0 || this.slidingIntention(engine) > 0;
    }
}
