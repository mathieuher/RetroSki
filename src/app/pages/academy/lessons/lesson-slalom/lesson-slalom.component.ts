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
    selector: 'app-slalom',
    imports: [ButtonIconComponent, NgTemplateOutlet, AcademyObjectiveComponent],
    templateUrl: './lesson-slalom.component.html',
    styleUrl: './lesson-slalom.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SlalomComponent implements AfterViewInit {
    protected lessonStep = signal(0);
    protected lessonFailed = signal(false);
    protected step2Completed = signal(false);

    private game?: Game;
    private settingsService = inject(SettingsService);
    private router = inject(Router);
    private trackFinished?: Subscription;
    private gateMissed?: Subscription;

    ngAfterViewInit(): void {
        const gatesConfig = TrackBuilder.getGatesConfig(TrackStyles.SL);
        gatesConfig.doubleGateAmount = 1;
        gatesConfig.tripleGateAmount = 1;
        gatesConfig.followingGateAmount = 1;
        const track = TrackBuilder.designTrack(
            'Academy slalom',
            TrackStyles.SL,
            20,
            20,
            true,
            gatesConfig,
            Config.SLOPE_LEGACY_CONFIG
        );
        const config = new AcademyConfig(track);
        this.game = new Game('academy', config, this.settingsService);
        this.game.initialize();
        this.game.on('start', () => {
            this.lessonStep.set(1);
        });
    }

    protected exitLesson(restart = false): void {
        this.game?.stopProperly();
        this.trackFinished?.unsubscribe();
        this.gateMissed?.unsubscribe();

        if (restart) {
            window.location.reload();
        } else {
            this.router.navigate(['/academy']);
        }
    }

    protected startStep2(): void {
        this.lessonStep.set(2);
        this.game!.paused = false;

        this.gateMissed = this.game!.customEvents.subscribe(event => {
            if (!this.step2Completed() && event.name === 'gate-event' && event.content === 'missed') {
                this.lessonFailed.set(true);
                this.game!.soundPlayer.playSound(Resources.GateMissedSound, Config.GATE_MISSED_SOUND_VOLUME);
                this.gateMissed!.unsubscribe();
            }
        });

        this.trackFinished = this.game!.customEvents.subscribe(event => {
            if (
                !this.step2Completed() &&
                !this.lessonFailed() &&
                event.name === 'academy-event' &&
                event.content === 'stopped'
            ) {
                this.step2Completed.set(true);
                setTimeout(() => {
                    this.startStep3();
                    this.gateMissed!.unsubscribe();
                    this.trackFinished!.unsubscribe();
                }, Config.AFTER_STEP_SMALL_WAITING_TIME);
            }
        });
    }

    protected startStep3(): void {
        this.lessonStep.set(3);
        this.game?.soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
        localStorage.setItem(AcademyComponent.LESSON_SLALOM_COMPLETED_KEY, 'true');
    }
}
