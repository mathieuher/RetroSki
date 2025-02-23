import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, type OnDestroy, signal } from '@angular/core';
import { ButtonIconComponent } from '../../../../common/components/button-icon/button-icon.component';
import { Router, RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { TrackStyles } from '../../../../game/models/track-styles.enum';
import { AcademyConfig } from '../../../../game/models/academy-config';
import { SettingsService } from '../../../../common/services/settings.service';
import { AcademyObjectiveComponent } from '../../../../common/components/academy-objective/academy-objective.component';
import { Game } from '../../../../game/game';
import { Config } from '../../../../game/config';
import { AcademyComponent } from '../../academy.component';
import { Track } from '../../../../game/models/track';
import { Resources } from '../../../../game/resources';
import type { SkierIntentions } from '../../../../game/actors/skier';

@Component({
    selector: 'app-basics',
    imports: [ButtonIconComponent, NgTemplateOutlet, RouterLink, AcademyObjectiveComponent],
    templateUrl: './lesson-basics.component.html',
    styleUrl: './lesson-basics.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicsComponent implements AfterViewInit, OnDestroy {
    private router = inject(Router);
    private settingsService = inject(SettingsService);

    protected controller = signal<'gamepad' | 'keyboard' | 'touch' | undefined>(undefined);
    protected lessonStep = signal(0);
    protected step2Completed = signal(false);
    protected step2Detail = {
        gamepad: 'Press "A" to start riding',
        keyboard: 'Press "Arrow UP" to start riding',
        touch: 'Touch the screen to start riding'
    };
    protected step3Completed = signal({ left: false, right: false });
    protected step3Detail = {
        gamepad: 'Use "Left stick" to carve',
        keyboard: 'Use "Arrow left/right" to carve',
        touch: 'Touch left/right zone to carve'
    };
    protected step4Completed = signal(false);
    protected step4Detail = {
        gamepad: 'Press "B" to brake',
        keyboard: 'Press "Spacebar" to brake',
        touch: 'Touch bottom zone to brake'
    };
    protected step5Completed = signal(false);

    private game?: Game;

    ngAfterViewInit(): void {
        const track = new Track(
            'basics',
            Config.CURRENT_BUILDER_VERSION,
            'Academy basics',
            TrackStyles.GS,
            new Date(),
            [],
            [],
            Config.DEFAULT_TRACK_SLOPE
        );
        const config = new AcademyConfig(track);
        this.game = new Game('academy', config, this.settingsService);
        this.game.initialize();
        this.game.on('start', () => {
            this.lessonStep.set(1);
        });
    }

    ngOnDestroy(): void {
        this.game?.stopProperly();
    }

    protected exitLesson(): void {
        this.game?.stopProperly();
        this.router.navigate(['/academy']);
    }

    protected startStep2(): void {
        this.lessonStep.set(2);
        const listener = this.game!.customEvents.subscribe((event: { name: string; content: SkierIntentions }) => {
            if (!this.step2Completed() && event.name === 'skier-actions' && event.content.hasStartingIntention) {
                this.step2Completed.set(true);
                setTimeout(() => {
                    this.startStep3();
                    listener.unsubscribe();
                }, Config.AFTER_STEP_SMALL_WAITING_TIME);
            }
        });
        this.game!.paused = false;
    }

    protected startStep3(): void {
        this.lessonStep.set(3);
        const listener = this.game!.customEvents.subscribe((event: { name: string; content: SkierIntentions }) => {
            if ((!this.step3Completed().left || !this.step3Completed().right) && event.name === 'skier-actions') {
                if (!this.step3Completed().right && event.content.rightCarvingIntention) {
                    this.step3Completed.set({ left: this.step3Completed().left, right: true });
                }
                if (!this.step3Completed().left && event.content.leftCarvingIntention) {
                    this.step3Completed.set({ left: true, right: this.step3Completed().right });
                }

                if (this.step3Completed().left && this.step3Completed().right) {
                    setTimeout(() => {
                        this.startStep4();
                        listener.unsubscribe();
                    }, Config.AFTER_STEP_LONG_WAITING_TIME);
                }
            }
        });
    }

    protected startStep4(): void {
        this.lessonStep.set(4);

        const listener = this.game!.customEvents.subscribe((event: { name: string; content: SkierIntentions }) => {
            if (!this.step4Completed() && event.name === 'skier-actions' && event.content.hasBrakingIntention) {
                this.step4Completed.set(true);
                setTimeout(() => {
                    this.startStep5();
                    listener.unsubscribe();
                }, Config.AFTER_STEP_LONG_WAITING_TIME);
            }
        });
    }

    protected startStep5(): void {
        this.lessonStep.set(5);
        const listener = this.game!.customEvents.subscribe((event: { name: string; content: SkierIntentions }) => {
            if (
                !this.step5Completed() &&
                event.name === 'skier-actions' &&
                event.content.hasBrakingIntention &&
                (event.content.leftCarvingIntention || event.content.rightCarvingIntention)
            ) {
                this.step5Completed.set(true);
                setTimeout(() => {
                    this.lessonStep.set(6);
                    this.game?.soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
                    localStorage.setItem(AcademyComponent.LESSON_BASICS_COMPLETED_KEY, 'true');
                    listener.unsubscribe();
                }, Config.AFTER_STEP_LONG_WAITING_TIME);
            }
        });
    }
}
