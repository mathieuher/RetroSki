import { Actor, Engine, Vector, vec, Audio } from 'excalibur';
import { Config } from '../config';
import { ScreenManager } from '../utils/screen-manager';
import { Spectator } from './spectator';
import { Race } from '../scenes/race';
import { Game } from '../game';
import { Resources } from '../resources';

export class SpectatorGroup extends Actor {
    private engine: Engine;
    private side: 'left' | 'right';
    private density: number;
    private sound = Config.SPECTATORS_SOUNDS[Math.round(Math.random() * (Config.SPECTATORS_SOUNDS.length - 1))];
    private soundInstance?: Audio;
    private shouldPlayIntenseSound = Math.random() < 0.15;

    constructor(engine: Engine, position: Vector, density: number, side: 'left' | 'right') {
        super({
            anchor: vec(0, 0),
            pos: position,
            height: density * (Config.SPECTATOR_HEIGHT * 0.7),
            width: Config.DISPLAY_MIN_MARGIN,
        });

        this.engine = engine;
        this.density = density;
        this.side = side;

        this.listenExitViewportEvent();

    }

    update(): void {
        if (ScreenManager.isNearScreen(this, this.scene.camera) && !this.children?.length) {
            this.buildSpectators();
            (this.engine as Game).soundPlayer.playSound(this.sound, 0.001, true, true);
            this.soundInstance = this.sound.instances[this.sound.instanceCount() - 1];
        }

        if (this.soundInstance) {
            this.adjustSoundVolume();
        }

        if (ScreenManager.isBehind(this.scene.camera.pos, this.pos.add(vec(0, this.height))) && this.shouldPlayIntenseSound) {
            this.shouldPlayIntenseSound = false;
            (this.engine as Game).soundPlayer.playSound(Resources.SpectatorsIntenseSound, 0.3, false, true);
        }


        if (this.children?.length) {
            this.rotateSpectators((this.scene as Race).skier!.pos);
        }
    }

    private listenExitViewportEvent(): void {
        this.on('exitviewport', () => this.checkForKill());
    }

    private checkForKill(): void {
        if (ScreenManager.isBehind(this.scene.camera.pos, this.pos)) {
            this.soundInstance?.stop();
            this.kill();
        }
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
        const distance = Math.min(Math.abs(this.pos.y - skierYPosition), 300);
        this.soundInstance!.volume = Math.max(0.001, 1 - (distance / 300)) * (this.density / 20) * 0.1;
    }

    private rotateSpectators(skierPosition: Vector): void {
    }


}
