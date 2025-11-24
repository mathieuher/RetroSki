import { Actor, CollisionType, Color, type Engine, type GpuParticleEmitter, vec } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import type { Race } from '../scenes/race';
import { ParticlesBuilder } from '../utils/particles-builder';
import type { SkierConfig } from '../models/skier-config';
import type { Game } from '../game';
import { SkierActions } from '../models/skier-actions.enum';
import { SkierGraphics } from '../utils/skier-graphics';
import { SkierFrontCollider } from './skier-front-collider';
import type { SkierInfos } from '../models/skier-infos';
import { TrackStyles } from '../models/track-styles.enum';
import { Section } from './section';

export class SkierIntentions {
    public leftCarvingIntention: number;
    public rightCarvingIntention: number;
    public hasBrakingIntention: boolean;
    public hasStartingIntention: boolean;

    constructor(
        leftCarvingIntention?: number,
        rightCarvingIntention?: number,
        hasBrakingIntention?: boolean,
        hasStartingIntention?: boolean
    ) {
        this.leftCarvingIntention = leftCarvingIntention ?? 0;
        this.rightCarvingIntention = rightCarvingIntention ?? 0;
        this.hasBrakingIntention = hasBrakingIntention ?? false;
        this.hasStartingIntention = hasStartingIntention ?? false;
    }
}

const LEFT_ANGLE_OFFSET = (3 / 4) * Math.PI;
const RIGHT_ANGLE_OFFSET = (1 / 4) * Math.PI;
const RADIAN_PI = 2 * Math.PI;
const RADIAN_TO_DEGREE = 180 / Math.PI;
const DEGREE_TO_RADIAN = Math.PI / 180;

export class Skier extends Actor {
    public speed = 0;
    public skierInfos: SkierInfos;
    public skierConfig: SkierConfig;

    public racing = false;
    public finish = false;

    private skierIntentions = new SkierIntentions();

    private leftParticlesEmitter!: GpuParticleEmitter;
    private rightParticlesEmitter!: GpuParticleEmitter;
    private updateParticlesLoop = 0;
    private updateSoundLoop = 0;

    constructor(skierInfos: SkierInfos, skierConfig: SkierConfig) {
        super({
            pos: vec(0, 0),
            width: 21,
            height: 30,
            z: 4,
            anchor: vec(0.5, 0.5),
            collisionType: CollisionType.Fixed
        });
        this.skierInfos = skierInfos;
        this.skierConfig = skierConfig;

        this.leftParticlesEmitter = ParticlesBuilder.getGpuParticlesEmitter('left');
        this.rightParticlesEmitter = ParticlesBuilder.getGpuParticlesEmitter('right');
        this.addChild(this.leftParticlesEmitter);
        this.addChild(this.rightParticlesEmitter);
        this.addChild(new SkierFrontCollider());
    }

    override update(engine: Engine): void {
        this.updateSkierIntentions(engine);
        const skierAction = this.getSkierCurrentAction();
        this.updateGraphics(skierAction);

        if (this.skierInfos.type === 'academy') {
            if ((this.scene?.engine as Game).paused) {
                return;
            }
            // Emit skier-actions for academy lessons
            (this.scene?.engine as Game).customEvents.emit({ name: 'skier-actions', content: this.skierIntentions });
        }

        this.updateParticlesLoop++;
        this.updateSoundLoop++;

        if (this.racing || this.finish) {
            this.updateRotation(this.skierIntentions);
            this.updateSpeed(skierAction, this.skierIntentions);
            this.updateVelocity(this.skierIntentions);
        } else {
            if (this.skierIntentions.hasStartingIntention) {
                (this.scene as Race).start();
            }
        }

        if (this.updateParticlesLoop === Config.THROTTLING_SKIER_PARTICLES) {
            this.updateParticlesLoop = 0;
            this.emitParticles(engine, skierAction, this.skierIntentions);
        }

        if (this.updateSoundLoop === Config.THROTTLING_SKIER_SOUND) {
            this.updateSoundLoop = 0;
            this.emitSounds(engine as Game, this.finish, this.skierIntentions);
        }
    }

    public finishRace(): void {
        this.racing = false;
        this.finish = true;
    }

    public startRace(): void {
        this.racing = true;
        (this.scene!.engine as Game).soundPlayer.playSound(Resources.TurningSound, 0, true, false);
    }

    public getSkierCurrentAction(): SkierActions {
        if (this.racing) {
            if (Skier.slidingIntention(this.skierIntentions)) {
                return this.skierIntentions.leftCarvingIntention ? SkierActions.SLIDE_LEFT : SkierActions.SLIDE_RIGHT;
            }
            if (this.skierIntentions.hasBrakingIntention) {
                return SkierActions.BRAKE;
            }
            if (Skier.carvingIntention(this.skierIntentions)) {
                return this.skierIntentions.leftCarvingIntention ? SkierActions.CARVE_LEFT : SkierActions.CARVE_RIGHT;
            }
            return SkierActions.NOTHING;
        }
        return SkierActions.BRAKE;
    }

    public static getSkierConfig(trackStyle: TrackStyles): SkierConfig {
        if (trackStyle === TrackStyles.SL) {
            return Config.SL_SKIER_CONFIG;
        }
        if (trackStyle === TrackStyles.GS) {
            return Config.GS_SKIER_CONFIG;
        }
        if (trackStyle === TrackStyles.SG) {
            return Config.SG_SKIER_CONFIG;
        }
        return Config.DH_SKIER_CONFIG;
    }

    private updateSkierIntentions(engine: Engine): void {
        this.skierIntentions.hasBrakingIntention = this.hasBreakingIntention(engine);
        this.skierIntentions.leftCarvingIntention = this.leftCarvingIntention(engine);
        this.skierIntentions.rightCarvingIntention = this.rightCarvingIntention(engine);
        this.skierIntentions.hasStartingIntention = this.hasStartingIntention(engine);
    }

    private updateRotation(skierIntentions: SkierIntentions): void {
        let rotationRate = 0;
        let futurRotation = 0;

        if (Skier.hasTurningIntention(skierIntentions)) {
            if (Skier.slidingIntention(skierIntentions)) {
                const rotationSpeedMultiplier =
                    this.speed < this.skierConfig.slidingOptimalSpeed
                        ? Math.max(this.speed, 1) / this.skierConfig.slidingOptimalSpeed
                        : 1;
                rotationRate =
                    (this.skierConfig.slidingRotationRate / RADIAN_TO_DEGREE) *
                    rotationSpeedMultiplier *
                    Skier.slidingIntention(skierIntentions);
            } else if (Skier.carvingIntention(skierIntentions)) {
                const rotationSpeedMultiplier =
                    this.speed < this.skierConfig.carvingOptimalSpeed
                        ? Math.max(this.speed, 1) / this.skierConfig.carvingOptimalSpeed
                        : 1;
                rotationRate =
                    (this.skierConfig.carvingRotationRate / RADIAN_TO_DEGREE) *
                    rotationSpeedMultiplier *
                    Skier.carvingIntention(skierIntentions);
            }
            futurRotation = Skier.hasLeftTurningIntention(skierIntentions)
                ? this.rotation - rotationRate
                : this.rotation + rotationRate;
        } else {
            const rotationCenterRate = Config.ROTATION_RECENTER_RATE / RADIAN_TO_DEGREE;
            const angularRotation = this.rotation * RADIAN_TO_DEGREE;
            if (angularRotation !== 0) {
                futurRotation =
                    angularRotation >= 270 ? this.rotation + rotationCenterRate : this.rotation - rotationCenterRate;
            }
        }

        const normalizedRotation = futurRotation * RADIAN_TO_DEGREE;

        if (normalizedRotation > 180 && normalizedRotation < 270) {
            this.rotation = Config.MAX_LEFT_ROTATION_ANGLE;
        } else if (normalizedRotation < 180 && normalizedRotation > 90) {
            this.rotation = Config.MAX_RIGHT_ROTATION_ANGLE;
        } else {
            this.rotation = futurRotation;
        }
    }

    private updateSpeed(skierAction: SkierActions, skierIntentions: SkierIntentions): void {
        let angleOfSkier = this.rotation * RADIAN_TO_DEGREE;
        if (angleOfSkier >= 270) {
            angleOfSkier = 360 - angleOfSkier;
        }
        angleOfSkier *= DEGREE_TO_RADIAN;
        const directionFactor = Math.cos(angleOfSkier);

        // Get the slope factor
        const sectionSlope = (this.scene as Race).getSection(this.pos)?.steep;
        const slopeFactor = sectionSlope
            ? Math.sin(sectionSlope * DEGREE_TO_RADIAN)
            : Math.sin((this.scene as Race).config.track.slope * 100 * DEGREE_TO_RADIAN);

        // Get the friction factor (wind + ground)
        const naturalFrictionFactor = this.skierConfig.windFrictionRate * (this.speed * this.speed);

        let brakingFactor = 0;

        if (skierAction === SkierActions.SLIDE_LEFT || skierAction === SkierActions.SLIDE_RIGHT) {
            brakingFactor = Config.SLIDING_BRAKING_RATE * Skier.slidingIntention(skierIntentions);
        } else if (skierAction === SkierActions.CARVE_LEFT || skierAction === SkierActions.CARVE_RIGHT) {
            brakingFactor = Config.CARVING_BRAKING_RATE * Skier.carvingIntention(skierIntentions);
        } else if (skierAction === SkierActions.BRAKE) {
            brakingFactor = Config.BRAKING_RATE;
        }

        let acceleration = Config.ACCELERATION_RATE * slopeFactor * directionFactor;
        acceleration -= naturalFrictionFactor + brakingFactor;

        const projectedSpeed = this.speed + acceleration;

        if (projectedSpeed < 0) {
            this.speed = 0;
        } else {
            this.speed = projectedSpeed;
        }
    }

    private updateVelocity(skierIntentions: SkierIntentions): void {
        let xVelocity = 0;
        let yVelocity = 0;
        const adherenceRate = this.getAdherenceRate(skierIntentions);
        const normalizedRotation = this.rotation * RADIAN_TO_DEGREE;
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

    private getAdherenceRate(skierIntentions: SkierIntentions): number {
        let adherenceRate = 1;
        if (Skier.hasTurningIntention(skierIntentions)) {
            adherenceRate = Skier.slidingIntention(skierIntentions)
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

    private emitSounds(engine: Game, forceBreaking: boolean, skierIntentions: SkierIntentions): void {
        if ((skierIntentions.hasBrakingIntention || forceBreaking) && this.speed) {
            Resources.TurningSound.volume = Math.min(
                Config.BRAKING_SOUND_VOLUME,
                (this.speed / Config.MAX_SPEED) * Config.BRAKING_SOUND_VOLUME
            );
        } else if (Skier.carvingIntention(skierIntentions) && this.speed) {
            Resources.TurningSound.volume = Math.min(
                Config.CARVING_SOUND_VOLUME,
                (this.speed / Config.MAX_SPEED) * Config.CARVING_SOUND_VOLUME * Skier.carvingIntention(skierIntentions)
            );
        } else {
            Resources.TurningSound.volume = 0;
        }
    }

    private emitParticles(engine: Engine, skierAction: SkierActions, skierIntentions: SkierIntentions): void {
        if (
            this.leftParticlesEmitter &&
            this.rightParticlesEmitter &&
            (engine as Game).settingsService.getSettings().particles
        ) {
            const speedPercentage = this.speed / Config.MAX_SPEED;

            // TODO Use particules color corresponding the slope steep
            const steep = (this.scene as Race).getSection(this.pos)?.steep;
            const particulesColor = steep ? Section.getSlopeColor(steep) : Color.Blue;

            this.leftParticlesEmitter.particle.opacity = 0.1;

            this.leftParticlesEmitter.particle.beginColor = particulesColor;
            this.rightParticlesEmitter.particle.beginColor = particulesColor;

            this.computeParticlesAngle();

            if (skierAction === SkierActions.SLIDE_LEFT || skierAction === SkierActions.SLIDE_RIGHT) {
                this.emitSlidingParticles(speedPercentage, Skier.slidingIntention(skierIntentions), skierAction);
            } else if (skierAction === SkierActions.CARVE_LEFT || skierAction === SkierActions.CARVE_RIGHT) {
                this.emitCarvingParticles(speedPercentage, Skier.carvingIntention(skierIntentions), skierAction);
            } else if (skierAction === SkierActions.BRAKE) {
                this.emitBrakingParticles(speedPercentage);
            }
        }
    }

    private emitSlidingParticles(speedPercentage: number, slidingIntensity: number, skierAction: SkierActions): void {
        const emittingRate = speedPercentage * slidingIntensity * 50;
        if (skierAction === SkierActions.SLIDE_LEFT) {
            this.rightParticlesEmitter.particle.minSpeed = 10;
            this.rightParticlesEmitter.particle.maxSpeed = speedPercentage * 200;
            this.rightParticlesEmitter.emitParticles(emittingRate);
        } else {
            this.leftParticlesEmitter.particle.minSpeed = 10;
            this.leftParticlesEmitter.particle.maxSpeed = speedPercentage * 100;
            this.leftParticlesEmitter.emitParticles(emittingRate);
        }
    }

    private emitCarvingParticles(speedPercentage: number, carvingIntensity: number, skierAction: SkierActions): void {
        const emittingRate = carvingIntensity * speedPercentage * 20;
        if (skierAction === SkierActions.CARVE_RIGHT) {
            this.leftParticlesEmitter.particle.minSpeed = 0;
            this.leftParticlesEmitter.particle.maxSpeed = 0;
            this.leftParticlesEmitter.emitParticles(emittingRate);
        } else {
            this.rightParticlesEmitter.particle.minSpeed = 0;
            this.rightParticlesEmitter.particle.maxSpeed = 0;
            this.rightParticlesEmitter.emitParticles(emittingRate);
        }
    }

    private emitBrakingParticles(speedPercentage: number): void {
        this.leftParticlesEmitter.particle.minSpeed = -10;
        this.leftParticlesEmitter.particle.maxSpeed = 30;

        this.rightParticlesEmitter.particle.minSpeed = -10;
        this.rightParticlesEmitter.particle.maxSpeed = 30;

        const emittingRate = speedPercentage * 20;
        this.leftParticlesEmitter.emitParticles(emittingRate);
        this.rightParticlesEmitter.emitParticles(emittingRate);
    }

    private hasBreakingIntention(engine: Engine): boolean {
        return (
            engine.input.keyboard.isHeld(Config.KEYBOARD_CONTROL_BRAKE) ||
            (engine as Game).gamepadsManager.isButtonHeld(Config.GAMEPAD_CONTROL_BRAKE) ||
            (this.scene as Race).touchManager.isTouchingBack
        );
    }

    private hasStartingIntention(engine: Engine): boolean {
        return (
            engine.input.keyboard.wasPressed(Config.KEYBOARD_START_KEY) ||
            (engine as Game).gamepadsManager.wasButtonPressed(Config.GAMEPAD_RACE_BUTTON) ||
            (this.scene as Race).touchManager.isTouching
        );
    }

    private static carvingIntention(skierIntentions: SkierIntentions): number {
        return Math.min(1, skierIntentions.leftCarvingIntention + skierIntentions.rightCarvingIntention);
    }

    private static slidingIntention(skierIntentions: SkierIntentions): number {
        return Math.min(1, Skier.leftSlidingIntention(skierIntentions) + Skier.rightSlidingIntention(skierIntentions));
    }

    private static hasTurningIntention(skierIntentions: SkierIntentions): boolean {
        return Skier.carvingIntention(skierIntentions) > 0 || Skier.slidingIntention(skierIntentions) > 0;
    }

    private static hasLeftTurningIntention(skierIntentions: SkierIntentions): boolean {
        return skierIntentions.leftCarvingIntention + Skier.leftSlidingIntention(skierIntentions) > 0;
    }

    private static leftSlidingIntention(skierIntentions: SkierIntentions): number {
        return skierIntentions.hasBrakingIntention && skierIntentions.leftCarvingIntention > 0
            ? skierIntentions.leftCarvingIntention
            : 0;
    }

    private static rightSlidingIntention(skierIntentions: SkierIntentions): number {
        return skierIntentions.hasBrakingIntention && skierIntentions.rightCarvingIntention > 0
            ? skierIntentions.rightCarvingIntention
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

    private computeParticlesAngle(): void {
        const leftAngle = this.rotation ? (this.rotation - LEFT_ANGLE_OFFSET) % RADIAN_PI : 3;
        const rightAngle = this.rotation ? (this.rotation - RIGHT_ANGLE_OFFSET) % RADIAN_PI : 3;
        this.leftParticlesEmitter.particle.minAngle = this.leftParticlesEmitter.particle.maxAngle = leftAngle;
        this.rightParticlesEmitter.particle.minAngle = this.rightParticlesEmitter.particle.maxAngle = rightAngle;
    }
}
