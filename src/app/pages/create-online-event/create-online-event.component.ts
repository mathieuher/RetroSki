import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { ServerTrack } from '../../common/models/server-track';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServerService } from '../../common/services/server.service';
import { takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TrackService } from '../../common/services/track.service';
import type { Track } from '../../game/models/track';

interface OnlineEventForm {
    name: FormControl<string | null>;
    type: FormControl<'time-attack' | 'race' | null>;
    races: FormControl<number | null>;
    track: FormControl<string | null>;
}

@Component({
    selector: 'app-create-online-event',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, RouterLink, ToolbarComponent],
    templateUrl: './create-online-event.component.html',
    styleUrl: './create-online-event.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateOnlineEventComponent extends Destroyable {
    protected form!: FormGroup<OnlineEventForm>;
    protected tracks: Signal<Track[] | undefined>;
    protected serverId: string;

    private trackService = inject(TrackService);
    private serverService = inject(ServerService);
    private location = inject(Location);
    private route = inject(ActivatedRoute);
    constructor() {
        super();
        this.serverId = (this.route.snapshot.params as { serverId: string }).serverId;
        this.initForm();
        this.listenTypeChange();
        this.tracks = toSignal(this.trackService.getTracks$('online'));
    }

    protected goBack() {
        this.location.back();
    }

    protected createEvent() {
        if (this.form.valid) {
            this.serverService
                .addEvent$(
                    this.form.value.name!,
                    this.form.value.races ?? 0,
                    this.serverId,
                    this.form.value.track!,
                    null
                )
                .pipe(
                    tap(() => this.goBack()),
                    takeUntil(this.destroyed$)
                )
                .subscribe();
        }
    }

    private initForm() {
        this.form = new FormGroup<OnlineEventForm>({
            name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
            type: new FormControl('race', Validators.required),
            races: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(10)]),
            track: new FormControl(null, Validators.required)
        });
    }

    private listenTypeChange(): void {
        this.form.controls.type.valueChanges
            .pipe(
                tap(value => {
                    if (value === 'race') {
                        this.form.controls.races.enable();
                    } else {
                        this.form.controls.races.disable();
                    }
                }),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }
}
