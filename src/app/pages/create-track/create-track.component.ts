import { ChangeDetectionStrategy, Component, inject, Signal, signal } from '@angular/core';
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
import { takeUntil, tap } from 'rxjs';
import { RideLocalComponent } from '../ride-local/ride-local.component';

interface CreateTrackForm {
    name: FormControl<string | null>;
    style: FormControl<TrackStyles | null>;
}

@Component({
    selector: 'app-create-track',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, ToolbarComponent],
    templateUrl: './create-track.component.html',
    styleUrl: './create-track.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateTrackComponent extends Destroyable {
    protected generatedTrack = signal<Track | undefined>(undefined);
    protected trackAlreadyUse = signal<boolean>(false);

    protected form = new FormGroup<CreateTrackForm>({
        name: new FormControl(null, [Validators.required]),
        style: new FormControl(TrackStyles.SL, [Validators.required])
    });

    private trackService = inject(TrackService);
    private location = inject(Location);

    constructor() {
        super();
        this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
            this.resetComputed();
            this.checkSimilarTrack(this.form.value.name!, this.form.value.style!);
        });
    }

    protected generateTrack(): void {
        this.generatedTrack.set(
            TrackBuilder.designTrack(this.form.value.name!.toLocaleLowerCase(), this.form.value.style!)
        );
    }

    protected saveTrack(): void {
        this.trackService
            .addTrack$(this.generatedTrack()!)
            .pipe(
                tap(trackNumber => localStorage.setItem(RideLocalComponent.TRACK_KEY, `${trackNumber}`)),
                tap(() => this.goBack()),
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

    private resetComputed(): void {
        this.generatedTrack.set(undefined);
    }
}
