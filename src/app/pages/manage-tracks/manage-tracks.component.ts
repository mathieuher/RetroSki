import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import type { Track } from '../../game/models/track';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TrackStyles } from '../../game/models/track-styles.enum';
import { TrackBuilder } from '../../game/utils/track-builder';
import { TrackService } from '../../common/services/track.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Location } from '@angular/common';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import { switchMap, takeUntil, tap } from 'rxjs';
import { RideLocalComponent } from '../ride-local/ride-local.component';
import { RouterLink } from '@angular/router';

interface CreateTrackForm {
    name: FormControl<string | null>;
    style: FormControl<TrackStyles | null>;
}

@Component({
    selector: 'app-manage-tracks',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, RouterLink, ToolbarComponent],
    templateUrl: './manage-tracks.component.html',
    styleUrl: './manage-tracks.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageTracksComponent extends Destroyable {
    protected generatedTrack = signal<Track | undefined>(undefined);
    protected trackAlreadyUse = signal<boolean>(false);
    protected existingTracks = signal<Track[] | undefined>([]);

    protected form = new FormGroup<CreateTrackForm>({
        name: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
        style: new FormControl(TrackStyles.SG, [Validators.required])
    });

    private trackService = inject(TrackService);
    private location = inject(Location);

    constructor() {
        super();

        this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            this.resetComputed();
            this.checkSimilarTrack(this.form.value.name!, this.form.value.style!);
        });

        this.trackService
            .getTracks$()
            .pipe(
                tap(tracks => this.existingTracks.set(tracks)),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    protected generateTrack(): void {
        this.generatedTrack.set(
            TrackBuilder.designTrack(this.form.value.name!.toLocaleLowerCase(), this.form.value.style!)
        );
        this.saveTrack();
    }

    protected saveTrack(): void {
        this.trackService
            .addTrack$(this.generatedTrack()!)
            .pipe(
                tap(trackNumber => localStorage.setItem(RideLocalComponent.TRACK_KEY, `${trackNumber}`)),
                tap(() => this.form.patchValue({ name: '' })),
                switchMap(() => this.trackService.getTracks$()),
                tap(tracks => this.existingTracks.set(tracks)),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    protected checkSimilarTrack(name: string, style: TrackStyles): void {
        this.trackService
            .isTrackAvailable$(name.toLocaleLowerCase(), style)
            .pipe(
                tap(available => this.trackAlreadyUse.set(available)),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    protected goBack(): void {
        this.location.back();
    }

    protected deleteTrack(track: Track): void {
        this.trackService
            .removeTrack$(track)
            .pipe(
                tap(tracks => this.existingTracks.set(tracks)),
                takeUntil(this.destroyed$)
            )
            .subscribe();
    }

    private resetComputed(): void {
        this.generatedTrack.set(undefined);
    }
}
