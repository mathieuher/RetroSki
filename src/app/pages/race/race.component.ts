import { ChangeDetectionStrategy, Component, inject, type OnInit, signal } from '@angular/core';
import { Game } from '../../game/game';
import { SettingsService } from '../../common/services/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { RaceConfig } from '../../game/models/race-config';
import type { RaceResult } from '../../game/models/race-result';
import { StockableRecord } from '../../game/models/stockable-record';
import { RankingLineComponent } from '../../common/components/ranking-line/ranking-line.component';
import { LocalEventService } from '../../common/services/local-event.service';
import type { LocalEvent } from '../../common/models/local-event';
import { TrackService } from '../../common/services/track.service';
import { concatMap, filter, from, map, type Observable, of, switchMap, takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import { RaceRanking } from '../../common/models/race-ranking';
import { Location } from '@angular/common';
import { EventService } from '../../common/services/event.service';
import { AuthService } from '../../common/services/auth.service';

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
    private eventService = inject(EventService);
    private trackService = inject(TrackService);
    private route = inject(ActivatedRoute);
    private settingsService = inject(SettingsService);
    private location = inject(Location);

    protected raceConfig = signal<RaceConfig | undefined>(undefined);
    protected raceRanking = signal<RaceRanking | undefined>(undefined);

    private game?: Game;

    private type = (this.route.snapshot.data as { type: 'local' | 'online' }).type;
    private eventId = (this.route.snapshot.params as { eventId: string }).eventId;
    private user = inject(AuthService).getUser();

    constructor() {
        super();
        if (this.type === 'local') {
            if (!this.localEventService.getEvent()) {
                this.router.navigate(['/local-event']);
            }
        }
    }

    ngOnInit(): void {
        const config$: Observable<RaceConfig> = this.type === 'local' ? this.buildLocalRaceConfig$(this.localEventService.getEvent()!) : this.buildOnlineRaceConfig$(this.eventId);

        config$.pipe(
            tap(config => {
                this.game = new Game(config, this.settingsService);
                this.game.initialize();
            }),
            tap(config => this.raceConfig.set(config)),
            tap(() => this.listenToRaceStop()),
            takeUntil(this.destroyed$)
        ).subscribe();
    }

    public override ngOnDestroy(): void {
        this.game?.stopProperly();
    }

    protected exitRace(): void {
        if (this.type === 'local') {
            this.router.navigate(['/local-event']);
        } else {
            this.router.navigate(['/online-event', this.eventId]);
        }
    }

    private buildLocalRaceConfig$(event: LocalEvent): Observable<RaceConfig> {
        return this.trackService
            .getTrackGhost$('local', event.track!.id!)
            .pipe(
                map(
                    globalGhost =>
                        new RaceConfig(event.id, event.incomingRaces[0].rider, event.track!, globalGhost, event.ghost)
                )
            );
    }

    private buildOnlineRaceConfig$(eventId: string): Observable<RaceConfig> {
        return this.eventService.getEvent$(eventId).pipe(
            switchMap(event => this.trackService.getTrack$('online', event.trackId!).pipe(
                map(track => new RaceConfig(event.id, this.user!.name!, track))
            ))
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
                tap(result => {
                    if (this.type === 'local') {
                        this.localEventService.addEventResult(result);
                    }
                }),
                map(
                    result =>
                        new StockableRecord(this.raceConfig()!.track.id!, result.rider, result.date, result.timing)
                ),
                concatMap(result => this.trackService.addTrackRecord$(this.type, this.eventId, result)),
                concatMap(() => this.trackService.getTrackRecords$(this.type, this.raceConfig()!.track.id!)),
                tap(results =>
                    this.raceRanking.set(new RaceRanking(results, raceResult.timing, raceResult.missedGates))
                ),
                concatMap(() => {
                    if (
                        !this.raceConfig()!.eventGhost?.totalTime ||
                        raceResult.timing < this.raceConfig()!.eventGhost!.totalTime!
                    ) {
                        if (this.type === 'online') {
                            return this.trackService.updateTrackGhost$(this.type, this.raceConfig()!.track.id!, raceResult.ghost);
                        }
                     this.localEventService.updateEventGhost(raceResult.ghost);
                    }
                    return of(null);
                }),
                concatMap(() => {
                    if (
                        !this.raceConfig()!.globalGhost?.totalTime ||
                        raceResult.timing < this.raceConfig()!.globalGhost!.totalTime!
                    ) {
                        return this.trackService.updateTrackGhost$(this.type, this.raceConfig()!.track.id!, raceResult.ghost);
                    }
                    return of(null);
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }
}
