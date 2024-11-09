import { ChangeDetectionStrategy, Component, inject, signal, Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { LocalEventService } from '../../common/services/local-event.service';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Track } from '../../game/models/track';
import { TrackService } from '../../common/services/track.service';
import { toSignal } from '@angular/core/rxjs-interop';

export interface LocalEventForm {
    track: FormControl<string | null>;
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
export class RideLocalComponent {
    protected availableTracks: Signal<Track[] | undefined>;

    protected form = new FormGroup<LocalEventForm>({
        track: new FormControl(null, [Validators.required, Validators.minLength(3)]),
        riders: new FormArray([
            new FormControl<string | null>(null, [Validators.required])
        ], [Validators.required]),
        races: new FormControl(2, [Validators.required, Validators.min(1), Validators.max(10)])
    });

    private router = inject(Router);
    private trackService = inject(TrackService);
    private localEventService = inject(LocalEventService);

    constructor() {
        this.availableTracks = toSignal(this.trackService.getTracks$());
    }

    protected addRider(): void {
        this.form.controls.riders.push(new FormControl(null, [Validators.required]));
    }

    protected removeRider(index: number): void {
        this.form.controls.riders.removeAt(index);
    }

    protected startEvent(): void {
        const track = this.availableTracks()?.find(track => track.fullName === this.form.value!.track);
        if(track) {
            this.localEventService.newEvent(track, this.form.value.riders as string[], this.form.value.races!);
            this.router.navigate(['/local-event']);
        }
    }
}
