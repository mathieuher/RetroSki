import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { UpdatesService } from '../../common/services/updates.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { AcademyComponent } from '../academy/academy.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, ToolbarComponent, ButtonIconComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
    private updatesService = inject(UpdatesService);
    protected academyCompleted = localStorage.getItem(AcademyComponent.LESSON_FINAL_COMPLETED_KEY) === 'true';
    protected hasNewUpdate = toSignal(this.updatesService.hasNewUpdates$());
}
