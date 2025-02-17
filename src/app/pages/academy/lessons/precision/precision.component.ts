import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SettingsService } from '../../../../common/services/settings.service';
import { Router, RouterLink } from '@angular/router';
import { Game } from '../../../../game/game';
import { AcademyConfig } from '../../../../game/models/academy-config';
import { TrackBuilder } from '../../../../game/utils/track-builder';
import { TrackStyles } from '../../../../game/models/track-styles.enum';
import { ButtonIconComponent } from '../../../../common/components/button-icon/button-icon.component';
import { NgTemplateOutlet } from '@angular/common';
import { AcademyObjectiveComponent } from '../../../../common/components/academy-objective/academy-objective.component';
import { Config } from '../../../../game/config';
import { AcademyComponent } from '../../academy.component';
import { Resources } from '../../../../game/resources';
import type { Subscription } from 'rxjs';

@Component({
    selector: 'app-precision',
    imports: [AcademyObjectiveComponent, ButtonIconComponent, NgTemplateOutlet, RouterLink],
    templateUrl: './precision.component.html',
    styleUrl: './precision.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrecisionComponent {
    private router = inject(Router);
    private settingsService = inject(SettingsService);

    protected lessonStep = signal(0);
    protected lessonFailed = signal(false);
    protected gatesPassed = signal(0);
    protected step2Completed = signal(false);
    protected trackFinished?: Subscription;
    protected gateListener?: Subscription;

    private game?: Game;

    ngAfterViewInit(): void {
        const track = TrackBuilder.designTrack('Academy precision', TrackStyles.GS, 100);
        const config = new AcademyConfig(track);
        this.game = new Game('academy', config, this.settingsService);
        this.game.initialize();
        this.game.on('start', () => {
            this.lessonStep.set(1);
            this.trackFinished = this.game?.customEvents.subscribe(event => {
                if (event.name === 'academy-event' && event.content === 'stopped') {
                    if (!this.step2Completed()) {
                        this.lessonFailed.set(true);
                    }
                    this.trackFinished!.unsubscribe();
                }
            });
        });
    }

    ngOnDestroy(): void {
        this.game?.stopProperly();
    }

    protected exitLesson(restart = false): void {
        this.game?.stopProperly();
        this.trackFinished?.unsubscribe();
        this.gateListener?.unsubscribe();

        if (restart) {
            window.location.reload();
        } else {
            this.router.navigate(['/academy']);
        }
    }

    protected startStep2(): void {
        this.lessonStep.set(2);
        this.game!.paused = false;
        this.gateListener = this.game!.customEvents.subscribe(event => {
            if (!this.step2Completed() && event.name === 'gate-event') {
                if (event.content === 'missed') {
                    this.gatesPassed.set(0);
                    this.game?.soundPlayer.playSound(Resources.GateMissedSound, Config.GATE_MISSED_SOUND_VOLUME);
                } else {
                    this.gatesPassed.set(this.gatesPassed() + 1);
                }

                if (this.gatesPassed() === 15) {
                    this.step2Completed.set(true);
                    setTimeout(() => {
                        this.startStep3();
                        this.gateListener!.unsubscribe();
                    }, Config.AFTER_STEP_SMALL_WAITING_TIME);
                }
            }
        });
    }

    protected startStep3(): void {
        this.lessonStep.set(3);
        this.game?.soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
        localStorage.setItem(AcademyComponent.LESSON_PRECISION_COMPLETED_KEY, 'true');
    }
}
