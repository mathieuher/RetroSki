import { ChangeDetectionStrategy, Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import type { Track } from '../../game/models/track';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackStyles } from '../../game/models/track-styles.enum';
import { TrackBuilder } from '../../game/utils/track-builder';
import { TrackService } from '../../common/services/track.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import { switchMap, takeUntil, tap } from 'rxjs';
import { RideLocalComponent } from '../ride-local/ride-local.component';
import { ActivatedRoute } from '@angular/router';

interface TrackForm {
    name: FormControl<string | null>;
    style: FormControl<TrackStyles | null>;
}

@Component({
    selector: 'app-manage-tracks',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, ToolbarComponent],
    templateUrl: './manage-tracks.component.html',
    styleUrl: './manage-tracks.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageTracksComponent extends Destroyable {
    protected generatedTrack = signal<Track | undefined>(undefined);
    protected trackAlreadyUse = signal<boolean>(false);
    protected managerType: 'local' | 'online';

    protected tracks = signal<Track[]>([]);

    protected form = new FormGroup<TrackForm>({
        name: new FormControl(null, [Validators.required, Validators.maxLength(16)]),
        style: new FormControl(TrackStyles.SG, [Validators.required])
    });

    private trackService = inject(TrackService);
    private location = inject(Location);
    private route = inject(ActivatedRoute);

    constructor() {
        super();
        this.managerType = (this.route.snapshot.data as { type: 'local' | 'online' }).type;
        // load existing tracks
        this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            this.checkSimilarTrack(this.form.value.name!, this.form.value.style!);
        });

        this.trackService
            .getTracks$(this.managerType)
            .pipe(
                tap(tracks => this.tracks.set(tracks)),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    protected generateTrack(): void {
        if (this.form.valid) {
            this.generatedTrack.set(
                TrackBuilder.designTrack(this.form.value.name!.toLocaleLowerCase(), this.form.value.style!)
            );
            this.saveTrack();
        }
    }

    protected saveTrack(): void {
        this.trackService
            .addTrack$(this.managerType, this.generatedTrack()!)
            .pipe(
                tap(trackNumber => {
                    if (this.managerType === 'local') {
                        localStorage.setItem(RideLocalComponent.TRACK_KEY, `${trackNumber}`);
                    }
                }),
                switchMap(() => this.trackService.getTracks$(this.managerType)),
                tap(tracks => this.tracks.set(tracks)),
                tap(() => this.form.controls.name.reset()),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    protected checkSimilarTrack(name: string | undefined, style: TrackStyles): void {
        const track = this.tracks().find(
            track => track.name.toLocaleLowerCase() === name?.toLocaleLowerCase() && track.style === style
        );
        this.trackAlreadyUse.set(!!track);
    }

    protected goBack(): void {
        this.location.back();
    }

    protected deleteTrack(track: Track): void {
        this.trackService
            .removeTrack$(this.managerType, track)
            .pipe(
                tap(tracks => this.tracks.set(tracks)),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }
}
