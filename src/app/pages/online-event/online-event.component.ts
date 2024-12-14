import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { RankingLineComponent } from '../../common/components/ranking-line/ranking-line.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { EventService } from '../../common/services/event.service';
import { JsonPipe, Location } from '@angular/common';
import type { OnlineEvent } from '../../common/models/online-event';
import { TrackService } from '../../common/services/track.service';
import { ResultLineComponent } from '../../common/components/result-line/result-line.component';

@Component({
    selector: 'app-online-event',
    standalone: true,
    imports: [ButtonIconComponent, ToolbarComponent, RankingLineComponent, ResultLineComponent],
    templateUrl: './online-event.component.html',
    styleUrl: './online-event.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OnlineEventComponent {
    protected event: Signal<OnlineEvent | undefined>;

    private eventService = inject(EventService);
    private route = inject(ActivatedRoute);
    private location = inject(Location);
    private trackService = inject(TrackService);

    constructor() {
        this.event = toSignal(this.eventService.getEvent$((this.route.snapshot.params as { id: string }).id));
    }

    public goBack() {
        this.location.back();
    }
}
