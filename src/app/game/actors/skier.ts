import { Actor, CollisionType, type Engine, type GpuParticleEmitter, vec } from 'excalibur';
import { Config } from '../config';
import { Resources } from '../resources';
import type { Race } from '../scenes/race';
import { ParticlesBuilder } from '../utils/particles-builder';
import type { SkierConfig } from '../models/skier-config';
import type { Game } from '../game';
import { SkierActions } from '../models/skier-actions.enum';
import { SkierGraphics } from '../utils/skier-graphics';
import type { SkierInfos } from '../models/skier-infos';
import { TrackStyles } from '../models/track-styles.enum';
import type { SlopeSection } from './slope-section';
import { SkiFrontCollider } from './ski-front-collider';
import { SkisCollider } from './skis-collider';
import { SkierBodyCollider } from './skier-body-collider';

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

const RADIAN_TO_DEGREE = 180 / Math.PI;
const DEGREE_TO_RADIAN = Math.PI / 180;
export class Skier extends Actor {
    public speed = 0;
    public skierInfos: SkierInfos;
    public skierConfig: SkierConfig;

    public racing = false;
    public finish = false;

    private skierIntentions = new SkierIntentions();

    private previousAction: SkierActions = SkierActions.NOTHING;
    private skierActionIntensity = 0;
    private leftParticlesEmitter!: GpuParticleEmitter;
    private rightParticlesEmitter!: GpuParticleEmitter;
    private updateParticlesLoop = 0;
    private updateSoundLoop = 0;

    private skisCollider = new SkisCollider();
    private frontSkiCollider = new SkiFrontCollider();
    private bodyCollider = new SkierBodyCollider();

    constructor(skierInfos: SkierInfos, skierConfig: SkierConfig) {
        super({
            pos: vec(0, 0),
            width: 32,
            height: 32,
            z: 4,
            anchor: vec(0.5, 0.5),
            collisionType: CollisionType.Passive
        });
        this.skierInfos = skierInfos;
        this.skierConfig = skierConfig;

        this.leftParticlesEmitter = ParticlesBuilder.getGpuParticlesEmitter('left');
        this.rightParticlesEmitter = ParticlesBuilder.getGpuParticlesEmitter('right');
        this.addChild(this.leftParticlesEmitter);
        this.addChild(this.rightParticlesEmitter);

        this.addChild(this.skisCollider);
        this.addChild(this.frontSkiCollider);
        this.addChild(this.bodyCollider);
    }

    override update(engine: Engine): void {
        this.updateSkierIntentions(engine);
        const skierAction = this.getSkierCurrentAction();
        // Build action intensity if same action as before
        this.updateActionIntensity(skierAction);
        this.updateGraphics(skierAction);
        this.updateColliders(skierAction);

        if (this.skierInfos.type === 'academy') {
            if ((this.scene?.engine as Game).paused) {
                return;
            }
            // Emit skier-actions for academy lessons
            (this.scene?.engine as Game).customEvents.emit({ name: 'skier-actions', content: this.skierIntentions });
        }

        this.updateParticlesLoop++;
        this.updateSoundLoop++;

        const currentSection = (this.scene as Race).getSectionAtPosition(this.pos);

        const actionIntensityRatio = this.skierActionIntensity / Config.MAX_ANIMATION_INTENSITY;

        if (this.racing || this.finish) {
            this.updateRotation(this.skierIntentions, actionIntensityRatio);
            this.updateSpeed(skierAction, this.skierIntentions, currentSection, actionIntensityRatio);
            this.updateVelocity(this.skierIntentions);
        } else {
            if (this.skierIntentions.hasStartingIntention) {
                (this.scene as Race).start();
            }
        }

        if (this.updateParticlesLoop === Config.THROTTLING_SKIER_PARTICLES) {
            this.updateParticlesLoop = 0;
            this.emitParticles(engine, skierAction, this.skierIntentions, currentSection, actionIntensityRatio);
        }

        if (this.updateSoundLoop === Config.THROTTLING_SKIER_SOUND) {
            this.updateSoundLoop = 0;
            this.emitSounds(this.finish, this.skierIntentions, actionIntensityRatio);
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

    private updateRotation(skierIntentions: SkierIntentions, actionIntensityRatio: number): void {
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
                    actionIntensityRatio *
                    Skier.slidingIntention(skierIntentions);
            } else if (Skier.carvingIntention(skierIntentions)) {
                const rotationSpeedMultiplier =
                    this.speed < this.skierConfig.carvingOptimalSpeed
                        ? Math.max(this.speed, 1) / this.skierConfig.carvingOptimalSpeed
                        : 1;
                rotationRate =
                    (this.skierConfig.carvingRotationRate / RADIAN_TO_DEGREE) *
                    rotationSpeedMultiplier *
                    actionIntensityRatio *
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

    private updateSpeed(
        skierAction: SkierActions,
        skierIntentions: SkierIntentions,
        currentSection: SlopeSection | null,
        actionIntensityRatio: number
    ): void {
        let angleOfSkier = this.rotation * RADIAN_TO_DEGREE;
        if (angleOfSkier >= 270) {
            angleOfSkier = 360 - angleOfSkier;
        }
        angleOfSkier *= DEGREE_TO_RADIAN;
        const directionFactor = Math.cos(angleOfSkier);

        // Get the slope factor
        const sectionIncline = currentSection?.incline || Config.SLOPE_CONFIG.defaultIncline;
        const slopeFactor = Math.sin(sectionIncline * DEGREE_TO_RADIAN);

        // Get the friction factor (wind + ground)
        const naturalFrictionFactor = this.skierConfig.windFrictionRate * (this.speed * this.speed);

        let brakingFactor = 0;

        if (skierAction === SkierActions.SLIDE_LEFT || skierAction === SkierActions.SLIDE_RIGHT) {
            brakingFactor =
                Config.SLIDING_BRAKING_RATE * actionIntensityRatio * Skier.slidingIntention(skierIntentions);
        } else if (skierAction === SkierActions.CARVE_LEFT || skierAction === SkierActions.CARVE_RIGHT) {
            brakingFactor =
                Config.CARVING_BRAKING_RATE * actionIntensityRatio * Skier.carvingIntention(skierIntentions);
        } else if (skierAction === SkierActions.BRAKE) {
            brakingFactor = Config.BRAKING_RATE * actionIntensityRatio;
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
        const graphic = SkierGraphics.getSpriteForAction('skier', currentAction, this.skierActionIntensity);
        this.graphics.use(graphic.sprite);
        this.graphics.flipHorizontal = !!graphic.flipHorizontal;
    }

    private emitSounds(forceBreaking: boolean, skierIntentions: SkierIntentions, actionIntensityRatio: number): void {
        if ((skierIntentions.hasBrakingIntention || forceBreaking) && this.speed) {
            Resources.TurningSound.volume = Math.min(
                Config.BRAKING_SOUND_VOLUME,
                (this.speed / Config.MAX_SPEED) * Config.BRAKING_SOUND_VOLUME * actionIntensityRatio
            );
        } else if (Skier.carvingIntention(skierIntentions) && this.speed) {
            Resources.TurningSound.volume = Math.min(
                Config.CARVING_SOUND_VOLUME,
                (this.speed / Config.MAX_SPEED) *
                    Config.CARVING_SOUND_VOLUME *
                    Skier.carvingIntention(skierIntentions) *
                    actionIntensityRatio
            );
        } else {
            Resources.TurningSound.volume = 0;
        }
    }

    private emitParticles(
        engine: Engine,
        skierAction: SkierActions,
        skierIntentions: SkierIntentions,
        currentSection: SlopeSection | null,
        actionIntensityRatio: number
    ): void {
        if (
            this.leftParticlesEmitter &&
            this.rightParticlesEmitter &&
            (engine as Game).settingsService.getSettings().particles
        ) {
            const speedPercentage = this.speed / Config.MAX_SPEED;

            const particulesColor = currentSection
                ? currentSection.config.particlesColor
                : Config.SLOPE_SECTION_WHITE_CONFIG.particlesColor;

            this.leftParticlesEmitter.particle.beginColor = particulesColor;
            this.rightParticlesEmitter.particle.beginColor = particulesColor;

            if (skierAction === SkierActions.SLIDE_LEFT || skierAction === SkierActions.SLIDE_RIGHT) {
                this.emitSlidingParticles(
                    speedPercentage,
                    Skier.slidingIntention(skierIntentions),
                    skierAction,
                    actionIntensityRatio
                );
            } else if (skierAction === SkierActions.CARVE_LEFT || skierAction === SkierActions.CARVE_RIGHT) {
                this.emitCarvingParticles(
                    speedPercentage,
                    Skier.carvingIntention(skierIntentions),
                    skierAction,
                    actionIntensityRatio
                );
            } else if (skierAction === SkierActions.BRAKE) {
                this.emitBrakingParticles(speedPercentage, actionIntensityRatio);
            }
        }
    }

    private emitSlidingParticles(
        speedPercentage: number,
        slidingIntensity: number,
        skierAction: SkierActions,
        actionIntensityRatio: number
    ): void {
        const emittingRate = speedPercentage * slidingIntensity * actionIntensityRatio * 60;
        const minSpeed = 30;
        const maxSpeed = speedPercentage * 250;
        if (skierAction === SkierActions.SLIDE_LEFT) {
            this.rightParticlesEmitter.particle.minSpeed = minSpeed;
            this.rightParticlesEmitter.particle.maxSpeed = maxSpeed;
            this.rightParticlesEmitter.particle.minAngle = -90 * DEGREE_TO_RADIAN;
            this.rightParticlesEmitter.particle.maxAngle = -45 * DEGREE_TO_RADIAN;
            this.rightParticlesEmitter.emitParticles(emittingRate);
        } else {
            this.leftParticlesEmitter.particle.minSpeed = minSpeed;
            this.leftParticlesEmitter.particle.maxSpeed = maxSpeed;
            this.leftParticlesEmitter.particle.minAngle = -90 * DEGREE_TO_RADIAN;
            this.leftParticlesEmitter.particle.maxAngle = -135 * DEGREE_TO_RADIAN;
            this.leftParticlesEmitter.emitParticles(emittingRate);
        }
    }

    private emitCarvingParticles(
        speedPercentage: number,
        carvingIntensity: number,
        skierAction: SkierActions,
        actionIntensityRatio: number
    ): void {
        const emittingRate = carvingIntensity * speedPercentage * actionIntensityRatio * 15;
        const minSpeed = 10;
        const maxSpeed = 50;
        if (skierAction === SkierActions.CARVE_RIGHT) {
            this.leftParticlesEmitter.particle.minSpeed = minSpeed;
            this.leftParticlesEmitter.particle.maxSpeed = maxSpeed;
            this.leftParticlesEmitter.particle.minAngle = 90 * DEGREE_TO_RADIAN;
            this.leftParticlesEmitter.particle.maxAngle = 90 * DEGREE_TO_RADIAN;
            this.leftParticlesEmitter.emitParticles(emittingRate);
        } else {
            this.rightParticlesEmitter.particle.minSpeed = minSpeed;
            this.rightParticlesEmitter.particle.maxSpeed = maxSpeed;
            this.rightParticlesEmitter.particle.minAngle = 90 * DEGREE_TO_RADIAN;
            this.rightParticlesEmitter.particle.maxAngle = 90 * DEGREE_TO_RADIAN;
            this.rightParticlesEmitter.emitParticles(emittingRate);
        }
    }

    private emitBrakingParticles(speedPercentage: number, actionIntensityRatio: number): void {
        const rightAngle = -30 * DEGREE_TO_RADIAN;
        const medianAngle = -90 * DEGREE_TO_RADIAN;
        const leftAngle = -150 * DEGREE_TO_RADIAN;
        const minSpeed = 50;
        const maxSpeed = 60;

        this.leftParticlesEmitter.particle.minSpeed = minSpeed;
        this.leftParticlesEmitter.particle.maxSpeed = maxSpeed;

        this.leftParticlesEmitter.particle.minAngle = medianAngle;
        this.leftParticlesEmitter.particle.maxAngle = leftAngle;

        this.rightParticlesEmitter.particle.minSpeed = minSpeed;
        this.rightParticlesEmitter.particle.maxSpeed = maxSpeed;

        this.rightParticlesEmitter.particle.minAngle = rightAngle;
        this.rightParticlesEmitter.particle.maxAngle = medianAngle;

        const emittingRate = speedPercentage * actionIntensityRatio * 30;
        this.leftParticlesEmitter.emitParticles(emittingRate);
        this.rightParticlesEmitter.emitParticles(emittingRate);
    }

    private hasBreakingIntention(engine: Engine): boolean {
        return (
            engine.input.keyboard.isHeld(Config.KEYBOARD_CONTROL_BRAKE) ||
            engine.input.keyboard.isHeld(Config.KEYBOARD_CONTROL_BRAKE_ALT) ||
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

    private updateActionIntensity(action: SkierActions): void {
        if (action === this.previousAction) {
            this.skierActionIntensity = Math.min(this.skierActionIntensity + 1, Config.MAX_ANIMATION_INTENSITY);
            return;
        }
        const intensity = this.getIntensityInteraction(this.previousAction, action);
        this.skierActionIntensity = intensity ? Math.max(this.skierActionIntensity + intensity, 0) : intensity;
        this.previousAction = action;
    }

    private getIntensityInteraction(previousAction: SkierActions, action: SkierActions): number {
        // Carve -> slide
        if (
            (previousAction === SkierActions.CARVE_LEFT && action === SkierActions.SLIDE_LEFT) ||
            (previousAction === SkierActions.CARVE_RIGHT && action === SkierActions.SLIDE_RIGHT)
        ) {
            return -Config.ANIMATION_FRAME_DURATION;
        }
        // Slide -> carve
        if (
            (previousAction === SkierActions.SLIDE_LEFT && action === SkierActions.CARVE_LEFT) ||
            (previousAction === SkierActions.SLIDE_RIGHT && action === SkierActions.CARVE_RIGHT)
        ) {
            return -Config.ANIMATION_FRAME_DURATION;
        }
        // Every other interaction
        return 0;
    }

    private updateColliders(action: SkierActions) {
        this.skisCollider.updatePosition(action);
        this.frontSkiCollider.updatePosition(action);
        this.bodyCollider.updatePosition(action);
    }
}
