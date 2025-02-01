import { ChangeDetectionStrategy, Component, inject, type OnDestroy, type Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LocalEventService } from '../../common/services/local-event.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Track } from '../../game/models/track';
import { TrackService } from '../../common/services/track.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StorageManager } from '../../game/utils/storage-manager';
import { tap } from 'rxjs';

interface LocalEventForm {
    track: FormControl<number | null>;
    riders: FormArray<FormControl<string | null>>;
    races: FormControl<number | null>;
}

@Component({
    selector: 'app-ride-local',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, RouterModule, RouterLink, ToolbarComponent],
    templateUrl: './ride-local.component.html',
    styleUrl: './ride-local.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideLocalComponent implements OnDestroy {
    public static TRACK_KEY = 'event_track';
    private static RIDERS_KEY = 'event_riders';
    private static RACES_KEY = 'event_races';

    protected availableTracks: Signal<Track[] | undefined>;

    protected form!: FormGroup<LocalEventForm>;

    private router = inject(Router);
    private trackService = inject(TrackService);
    private localEventService = inject(LocalEventService);

    constructor() {
        this.availableTracks = toSignal(
            this.trackService.getTracks$('local').pipe(tap(tracks => this.initForm(tracks)))
        );
    }

    ngOnDestroy(): void {
        // Persist setup
        if (this.form.value.track) {
            StorageManager.save(RideLocalComponent.TRACK_KEY, `${this.form.value.track}`);
        }

        StorageManager.save(RideLocalComponent.RIDERS_KEY, this.form.value.riders?.filter(Boolean).join(';')!);
        StorageManager.save(RideLocalComponent.RACES_KEY, `${this.form.value.races}` || '');
    }

    protected addRider(rider?: string): void {
        this.form.controls.riders.push(new FormControl(rider ?? null, [Validators.required]));
    }

    protected removeRider(index: number): void {
        this.form.controls.riders.removeAt(index);
    }

    protected startEvent(): void {
        const track = this.availableTracks()?.find(track => track.id === this.form.value!.track);
        if (track) {
            this.localEventService.newEvent(track, this.form.value.riders as string[], this.form.value.races!);
            this.router.navigate(['/local-event']);
        }
    }

    private initForm(tracks: Track[]): void {
        // Load default riders
        const defaultRiders = localStorage.getItem(RideLocalComponent.RIDERS_KEY)?.split(';') ?? [''];
        const trackKey = localStorage.getItem(RideLocalComponent.TRACK_KEY);
        const defaultTrack = trackKey && tracks.some(track => +track.id! === +trackKey) ? +trackKey : 0;
        const defaultRaces = localStorage.getItem(RideLocalComponent.RACES_KEY)
            ? +localStorage.getItem(RideLocalComponent.RACES_KEY)!
            : 2;

        this.form = new FormGroup<LocalEventForm>({
            track: new FormControl(defaultTrack, [Validators.required, Validators.min(1)]),
            riders: new FormArray(
                [
                    new FormControl<string | null>(defaultRiders.splice(0, 1)[0], [
                        Validators.required,
                        Validators.maxLength(16)
                    ])
                ],
                [Validators.required]
            ),
            races: new FormControl(defaultRaces, [Validators.required, Validators.min(1), Validators.max(10)])
        });

        if (defaultRiders.length) {
            for (const rider of defaultRiders) {
                this.addRider(rider);
            }
        }
    }
}
