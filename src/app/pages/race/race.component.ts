import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { Game } from '../../game/game';
import { SettingsService } from '../../common/services/settings.service';
import { Router } from '@angular/router';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { RaceConfig } from '../../game/models/race-config';
import type { RaceResult } from '../../game/models/race-result';
import { StockableRecord } from '../../game/models/stockable-record';
import { RankingLineComponent } from '../../common/components/ranking-line/ranking-line.component';
import { format } from 'date-fns';
import { Config } from '../../game/config';
import { LocalEventService } from '../../common/services/local-event.service';
import type { LocalEvent } from '../../common/models/local-event';
import { TrackService } from '../../common/services/track.service';
import { filter, from, map, type Observable, of, switchMap, takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';

class RaceRanking {
    public trackRecords: StockableRecord[];
    public timing: number;
    public penalties: number;

    constructor(trackRecords: StockableRecord[], timing: number, penalties: number) {
        this.trackRecords = trackRecords;
        this.timing = timing;
        this.penalties = penalties;
    }

    public get positionLabel(): string {
        const position = +this.position;
        if (position > 3) {
            return `${position}th`;
        }
        if (position === 3) {
            return `${position}rd`;
        }
        if (position === 2) {
            return `${position}nd`;
        }
        return `${position}st`;
    }

    public getDiffTime(timing: number): string {
        const diff = timing - this.referenceTime;
        return `+${format(diff, diff >= 60000 ? 'mm:ss:SS' : 'ss:SS')}`;
    }

    public get formattedTime(): string {
        return format(this.timing, 'mm:ss:SS');
    }

    public get penaltiesLabel(): string {
        if (this.penalties) {
            if (this.penalties > 1) {
                return `${this.penalties} penalties (+${this.penalties * (Config.MISSED_GATE_PENALTY_TIME / 1000)}s)`;
            }
            return `${this.penalties} penalty (+${Config.MISSED_GATE_PENALTY_TIME / 1000}s)`;
        }
        return '';
    }

    public get position(): number {
        return this.trackRecords.filter(record => record.timing < this.timing).length + 1;
    }

    private get referenceTime(): number {
        return this.trackRecords[0].timing;
    }
}

@Component({
    selector: 'app-race',
    standalone: true,
    imports: [ButtonIconComponent, RankingLineComponent],
    templateUrl: './race.component.html',
    styleUrl: './race.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceComponent extends Destroyable implements OnInit {
    private router = inject(Router);
    private localEventService = inject(LocalEventService);
    private trackService = inject(TrackService);

    private settingsService = inject(SettingsService);

    protected raceConfig?: RaceConfig;
    protected raceRanking = signal<RaceRanking | undefined>(undefined);

    private game?: Game;

    constructor() {
        super();
        if (!event) {
            this.router.navigate(['/local-event']);
        }
    }

    ngOnInit(): void {
        this.buildRaceConfig$(this.localEventService.getEvent()!)
            .pipe(
                tap(config => {
                    console.log('new game : config', config);
                    this.game = new Game(config, this.settingsService);
                    this.game.initialize();
                }),
                tap(() => this.listenToRaceStop()),
                takeUntil(this.destroyed$)
            )
            .subscribe(config => (this.raceConfig = config));
    }

    protected exitRace(): void {
        this.game!.stop();
        this.game = undefined;
        this.router.navigate(['/local-event']);
    }

    private buildRaceConfig$(event: LocalEvent): Observable<RaceConfig> {
        return this.trackService
            .getTrackGhost$(event.track!.id!)
            .pipe(
                map(
                    globalGhost =>
                        new RaceConfig(event.id, event.incomingRaces[0].rider, event.track!, globalGhost, event.ghost)
                )
            );
    }

    private listenToRaceStop(): void {
        let raceResult: RaceResult;
        from(this.game!.raceStopped)
            .pipe(
                tap(result => {
                    if (!result) {
                        this.exitRace();
                    }
                }),
                filter(Boolean),
                tap(result => (raceResult = result)),
                tap(result => this.localEventService.addEventResult(result)),
                map(
                    result => new StockableRecord(this.raceConfig!.track.id!, result.rider, result.date, result.timing)
                ),
                switchMap(result => this.trackService.addTrackRecord$(result)),
                switchMap(() => this.trackService.getTrackRecords$(this.raceConfig!.track.id!)),
                tap(results =>
                    this.raceRanking.set(new RaceRanking(results, raceResult.timing, raceResult.missedGates))
                ),
                tap(() => {
                    if (
                        !this.raceConfig!.eventGhost?.totalTime ||
                        raceResult.timing < this.raceConfig!.eventGhost.totalTime
                    ) {
                        this.localEventService.updateEventGhost(raceResult.ghost);
                    }
                }),
                switchMap(() => {
                    if (
                        !this.raceConfig!.globalGhost?.totalTime ||
                        raceResult.timing < this.raceConfig!.globalGhost.totalTime
                    ) {
                        return this.trackService.updateTrackGhost$(raceResult.ghost);
                    }
                    return of(null);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    /*
    private saveGhosts(result: RaceResult, globalResult: GlobalResult): void {
        if (globalResult?.position === 1) {
			GhostManager.setGlobalGhost(result.ghost);
		}

		if (!this.raceConfig.eventGhost || result.timing < this.raceConfig.eventGhost?.totalTime!) {
			GhostManager.setEventGhost(result.ghost);
		}
    }
        */
}
