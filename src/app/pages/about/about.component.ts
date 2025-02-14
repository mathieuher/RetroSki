import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { RouterLink } from '@angular/router';
import { ExpanderComponent } from '../../common/components/expander/expander.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { type Update, UpdatesService } from '../../common/services/updates.service';

@Component({
    selector: 'app-about',
    imports: [ButtonIconComponent, DatePipe, ExpanderComponent, RouterLink, ToolbarComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
    private updatesService = inject(UpdatesService);
    protected updates: Signal<Update[] | undefined> = toSignal(this.updatesService.getUpdates$());

    constructor() {
        this.updatesService.setLastConsultedDate();
    }
}
