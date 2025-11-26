import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonIconComponent } from '../../../../common/components/button-icon/button-icon.component';
import { TrackBuilder } from '../../../../game/utils/track-builder';
import { TrackStyles } from '../../../../game/models/track-styles.enum';
import { AcademyConfig } from '../../../../game/models/academy-config';
import { Game } from '../../../../game/game';
import { SettingsService } from '../../../../common/services/settings.service';
import type { Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { AcademyObjectiveComponent } from '../../../../common/components/academy-objective/academy-objective.component';
import { Router } from '@angular/router';
import { Resources } from '../../../../game/resources';
import { Config } from '../../../../game/config';
import { AcademyComponent } from '../../academy.component';

@Component({
    selector: 'app-optimizing-trajectory',
    imports: [ButtonIconComponent, NgTemplateOutlet, AcademyObjectiveComponent],
    templateUrl: './lesson-optimizing-trajectory.component.html',
    styleUrl: './lesson-optimizing-trajectory.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OptimizingTrajectoryComponent implements AfterViewInit {
    protected readonly objectiveGateNumber = 30;
    protected lessonStep = signal(0);
    protected lessonFailed = signal(false);
    protected step2Completed = signal(false);
    protected gatesPassed = signal(0);

    private game?: Game;
    private settingsService = inject(SettingsService);
    private router = inject(Router);
    private trackFinished?: Subscription;
    private gateEvents?: Subscription;

    ngAfterViewInit(): void {
        const track = TrackBuilder.designTrack(
            'Academy slalom',
            TrackStyles.SG,
            40,
            40,
            true,
            undefined,
            Config.SLOPE_LEGACY_CONFIG
        );
        const config = new AcademyConfig(track);
        this.game = new Game('academy', config, this.settingsService, { useOptimizedTrajectoryDetector: true });
        this.game.initialize();
        this.game.on('start', () => {
            this.lessonStep.set(1);
        });
    }

    protected exitLesson(restart = false): void {
        this.game?.stopProperly();
        this.trackFinished?.unsubscribe();
        this.gateEvents?.unsubscribe();

        if (restart) {
            window.location.reload();
        } else {
            this.router.navigate(['/academy']);
        }
    }

    protected startStep2(): void {
        this.lessonStep.set(2);
        this.game!.paused = false;

        this.gateEvents = this.game!.customEvents.subscribe(event => {
            if (event.name === 'gate-event') {
                if (event.content === 'missed') {
                    this.game!.soundPlayer.playSound(Resources.GateMissedSound, Config.GATE_MISSED_SOUND_VOLUME);
                }

                if (event.content === 'passed') {
                    this.gatesPassed.set(this.gatesPassed() + 1);
                    if (!this.step2Completed() && this.gatesPassed() >= this.objectiveGateNumber) {
                        this.step2Completed.set(true);
                    }
                }
            }
        });

        this.trackFinished = this.game!.customEvents.subscribe(event => {
            if (event.name === 'academy-event' && event.content === 'stopped') {
                if (this.step2Completed()) {
                    this.startStep3();
                } else {
                    this.lessonFailed.set(true);
                }

                this.gateEvents!.unsubscribe();
                this.trackFinished!.unsubscribe();
            }
        });
    }

    protected startStep3(): void {
        this.lessonStep.set(3);
        this.game?.soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
        localStorage.setItem(AcademyComponent.LESSON_TRAJECTORY_COMPLETED_KEY, 'true');
    }
}
