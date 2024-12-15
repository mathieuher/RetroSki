import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { RankingLineComponent } from '../../common/components/ranking-line/ranking-line.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { EventService } from '../../common/services/event.service';
import type { OnlineEvent } from '../../common/models/online-event';
import { TrackService } from '../../common/services/track.service';
import { ResultLineComponent } from '../../common/components/result-line/result-line.component';
import type { Track } from '../../game/models/track';
import type { EventResult } from '../../common/models/event-result';
import type { EventRanking } from '../../common/models/event-ranking';
import { AuthService } from '../../common/services/auth.service';
import type { User } from '../../common/models/user';

@Component({
    selector: 'app-online-event',
    standalone: true,
    imports: [ButtonIconComponent, ToolbarComponent, RankingLineComponent, ResultLineComponent, RouterLink],
    templateUrl: './online-event.component.html',
    styleUrl: './online-event.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlineEventComponent {
    protected event: Signal<OnlineEvent | undefined>;
    protected track: Signal<Track | undefined>;
    protected results: Signal<EventResult[] | undefined>;
    protected rankings: Signal<EventRanking[] | undefined>;
    protected remainingRaces: Signal<number[] | undefined>;
    protected user: User | null;

    private eventService = inject(EventService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private trackService = inject(TrackService);
    private authService = inject(AuthService);

    constructor() {
        this.user = this.authService.getUser();

        this.event = toSignal(this.eventService.getEvent$((this.route.snapshot.params as { id: string }).id));

        this.track = rxResource({
            request: this.event,
            loader: event => this.trackService.getTrack$('online', event.request?.trackId!)
        }).value;

        this.results = rxResource({
            request: this.event,
            loader: event => this.eventService.getResults$(event.request?.id!)
        }).value;

        this.rankings = computed(() =>
            this.eventService.buildRankings(this.event()!.racesLimit, this.results() ? [...this.results()!] : [])
        );

        this.remainingRaces = computed(() => this.getRemainingRaces(this.event(), this.results()));
    }

    public goBack() {
        this.router.navigate(['/server', this.event()?.serverId]);
    }

    private getRemainingRaces(event: OnlineEvent | undefined, results: EventResult[] | undefined): number[] {
        if (!event || !results) {
            return [];
        }
        const numberOfRaces = results.filter(r => r.rider === this.user?.name).length;
        if (numberOfRaces >= event.racesLimit) {
            return [];
        }
        const remainingRaces = [];
        for (let i = numberOfRaces; i < event.racesLimit; i++) {
            remainingRaces.push(i + 1);
        }
        return remainingRaces;
    }
}
