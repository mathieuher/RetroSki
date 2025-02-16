import { type AfterViewInit, ChangeDetectionStrategy, Component, inject, type OnDestroy, signal } from '@angular/core';
import { ButtonIconComponent } from '../../../../common/components/button-icon/button-icon.component';
import { Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { TrackBuilder } from '../../../../game/utils/track-builder';
import { TrackStyles } from '../../../../game/models/track-styles.enum';
import { AcademyConfig } from '../../../../game/models/academy-config';
import { SettingsService } from '../../../../common/services/settings.service';
import { AcademyObjectiveComponent } from '../../../../common/components/academy-objective/academy-objective.component';
import { Game } from '../../../../game/game';

@Component({
    selector: 'app-basics',
    imports: [ButtonIconComponent, NgTemplateOutlet, AcademyObjectiveComponent],
    templateUrl: './basics.component.html',
    styleUrl: './basics.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasicsComponent implements AfterViewInit, OnDestroy {
    private router = inject(Router);
    private settingsService = inject(SettingsService);

    protected lessonStep = signal(0);
    protected step2Completed = signal(false);

    private game?: Game;

    ngAfterViewInit(): void {
        const track = TrackBuilder.designTrack('basics', TrackStyles.GS);
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
        this.game!.customEvents.subscribe(event => {
            if (!this.step2Completed() && event.name === 'skier-actions' && event.content.hasStartingIntention) {
                this.step2Completed.set(true);
            }
        });
        this.game!.paused = false;
    }
}
