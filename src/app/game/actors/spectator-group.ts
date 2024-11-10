import { Actor, type Engine, type Vector, vec, type Audio } from 'excalibur';
import { Config } from '../config';
import { ScreenManager } from '../utils/screen-manager';
import { Spectator } from './spectator';
import type { Race } from '../scenes/race';
import type { Game } from '../game';
import { Resources } from '../resources';

export class SpectatorGroup extends Actor {
    private engine: Engine;
    private side: 'left' | 'right';
    private density: number;
    private sound = Config.SPECTATORS_SOUNDS[~~(Math.random() * Config.SPECTATORS_SOUNDS.length)];
    private soundInstance?: Audio;
    private shouldPlayIntenseSound = Math.random() < Config.SPECTATORS_INTENSE_SOUND_PROBABILITY;
    private shouldPlayBellsSound = Math.random() < Config.SPECTATORS_BELLS_SOUND_PROBABILITY;
    private bellsSound = this.shouldPlayBellsSound
        ? Config.SPECTATORS_BELLS_SOUNDS[~~(Math.random() * Config.SPECTATORS_BELLS_SOUNDS.length)]
        : null;
    private bellsSoundInstance?: Audio;
    private centerPoint!: Vector;

    constructor(engine: Engine, position: Vector, density: number, side: 'left' | 'right') {
        super({
            anchor: vec(0, 0),
            pos: position,
            height: density * (Config.SPECTATOR_HEIGHT * 0.7),
            width: Config.DISPLAY_MIN_MARGIN
        });

        this.engine = engine;
        this.density = density;
        this.side = side;
        this.centerPoint = vec(this.pos.x + this.width / 2, this.pos.y + this.height / 2);

        this.listenExitViewportEvent();
    }

    override update(): void {
        if (ScreenManager.isNearScreen(this, this.scene.camera) && !this.children?.length) {
            this.buildSpectators();
            (this.engine as Game).soundPlayer.playSound(this.sound, 0.001, true, true);
            this.soundInstance = this.sound.instances[this.sound.instanceCount() - 1];
            if (this.shouldPlayBellsSound) {
                (this.engine as Game).soundPlayer.playSound(this.bellsSound!, 0.001, true, true);
                this.bellsSoundInstance = this.bellsSound!.instances[this.bellsSound!.instanceCount() - 1];
            }
        }

        if (this.soundInstance) {
            this.adjustSoundVolume();
        }

        if (
            ScreenManager.isBehind(this.scene.camera.pos, this.pos.add(vec(0, this.height))) &&
            this.shouldPlayIntenseSound
        ) {
            this.shouldPlayIntenseSound = false;
            (this.engine as Game).soundPlayer.playSound(Resources.SpectatorsIntenseSound, 0.3, false, true);
        }

        if (this.children?.length) {
            this.rotateSpectators();
        }
    }

    private listenExitViewportEvent(): void {
        this.on('exitviewport', () => this.checkForKill());
    }

    private checkForKill(): void {
        if (ScreenManager.isBehind(this.scene.camera.pos, this.pos)) {
            this.kill();
        }
    }

    override onPreKill(): void {
        this.soundInstance?.stop();
        this.bellsSoundInstance?.stop();
    }

    private buildSpectators(): void {
        for (let i = 1; i <= this.density; i++) {
            const xPosition = Math.random() * (this.width - Config.SPECTATOR_WIDTH);
            const yPosition = Math.random() * (this.height - Config.SPECTATOR_HEIGHT);
            const rotation = this.side === 'left' ? 0 : 180;
            this.addChild(new Spectator(vec(xPosition, yPosition), rotation));
        }
    }

    private adjustSoundVolume(): void {
        const skierYPosition = (this.scene as Race).skier!.pos.y;
        const distance = Math.min(Math.abs(this.pos.y - skierYPosition), Config.SPECTATORS_MAX_SOUND_DISTANCE);
        this.soundInstance!.volume =
            Math.max(0.001, 1 - distance / Config.SPECTATORS_MAX_SOUND_DISTANCE) *
            (this.density / Config.SPECTATORS_MAX_DENSITY) *
            Config.SPECTATORS_SOUND_INTENSITY;
        if (this.bellsSoundInstance) {
            this.bellsSoundInstance!.volume =
                Math.max(0.001, 1 - distance / Config.SPECTATORS_MAX_SOUND_DISTANCE) *
                Config.SPECTATORS_BELLS_SOUND_INTENSITY;
        }
    }

    private rotateSpectators(): void {
        const skierPos = (this.scene as Race).skier?.pos;
        const angle = Math.atan2(skierPos!.y - this.centerPoint.y, skierPos!.x - this.centerPoint.x);
        for (const spectator of this.children as Spectator[]) {
            spectator.rotation = angle;
        }
    }
}
