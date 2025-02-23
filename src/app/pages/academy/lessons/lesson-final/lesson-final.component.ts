import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonIconComponent } from '../../../../common/components/button-icon/button-icon.component';
import { Game } from '../../../../game/game';
import { SettingsService } from '../../../../common/services/settings.service';
import { map, type Observable, switchMap, takeUntil, tap, type Subscription } from 'rxjs';
import { NgTemplateOutlet } from '@angular/common';
import { AcademyObjectiveComponent } from '../../../../common/components/academy-objective/academy-objective.component';
import { Router } from '@angular/router';
import { Resources } from '../../../../game/resources';
import { Config } from '../../../../game/config';
import { AcademyComponent } from '../../academy.component';
import { HttpClient } from '@angular/common/http';
import { Destroyable } from '../../../../common/components/destroyable/destroyable.component';
import { StockableTrack } from '../../../../game/models/stockable-track';
import { AcademyConfig } from '../../../../game/models/academy-config';
import { StockableGhost } from '../../../../game/models/stockable-ghost';
import type { Track } from '../../../../game/models/track';

@Component({
    selector: 'app-lesson-final',
    imports: [AcademyObjectiveComponent, ButtonIconComponent, NgTemplateOutlet],
    templateUrl: './lesson-final.component.html',
    styleUrl: './lesson-final.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LessonFinalComponent extends Destroyable implements AfterViewInit {
    protected readonly objectiveGateNumber = 30;
    protected lessonStep = signal(0);
    protected lessonFailed = signal(false);
    protected step2Completed = signal(false);

    private game?: Game;
    private raceListener?: Subscription;
    private settingsService = inject(SettingsService);
    private router = inject(Router);
    private http = inject(HttpClient);

    ngAfterViewInit(): void {
        this.getTrack$()
            .pipe(
                map(track => new AcademyConfig(track)),
                switchMap(config =>
                    this.getGhost$().pipe(
                        map(ghost => {
                            config.eventGhost = ghost;
                            return config;
                        })
                    )
                ),
                map(config => new Game('academy', config, this.settingsService)),
                tap(game => {
                    game.initialize();
                    game.on('start', () => {
                        this.lessonStep.set(1);
                    });
                    this.game = game;
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    protected exitLesson(restart = false): void {
        this.game?.stopProperly();
        this.raceListener?.unsubscribe();

        if (restart) {
            window.location.reload();
        } else {
            this.router.navigate(['/academy']);
        }
    }

    protected startStep2(): void {
        this.lessonStep.set(2);
        this.game!.paused = false;

        // listen to end of the race
        this.raceListener = this.game!.customEvents.subscribe(event => {
            if (!this.lessonFailed() && event.name === 'result-event') {
                if (event.content === 1) {
                    this.step2Completed.set(true);
                    setTimeout(() => this.startStep3(), Config.AFTER_STEP_SMALL_WAITING_TIME);
                } else {
                    this.lessonFailed.set(true);
                    this.raceListener!.unsubscribe();
                }
            }

            if (event.name === 'gate-event' && event.content === 'missed') {
                this.lessonFailed.set(true);
                this.raceListener!.unsubscribe();
            }
        });
    }

    protected startStep3(): void {
        this.lessonStep.set(3);
        this.game?.soundPlayer.playSound(Resources.FinishRaceSound, Config.FINISH_SOUND_VOLUME);
        localStorage.setItem(AcademyComponent.LESSON_FINAL_COMPLETED_KEY, 'true');
    }

    private getTrack$(): Observable<Track> {
        return this.http.get('/assets/academy/track.json').pipe(
            map(stockableTrack => Object.assign(new StockableTrack(), stockableTrack)),
            map(stockableTrack => stockableTrack.toTrack())
        );
    }

    private getGhost$(): Observable<StockableGhost> {
        return this.http
            .get<StockableGhost>('/assets/academy/ghost.json')
            .pipe(map(stockableGhost => Object.assign(new StockableGhost(), stockableGhost)));
    }
}
