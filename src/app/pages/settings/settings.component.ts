import { ChangeDetectionStrategy, Component, computed, effect, inject, model, ModelSignal, signal, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { CheckboxComponent } from '../../common/components/checkbox/checkbox.component';
import { Location } from '@angular/common';
import { SettingsService } from '../../common/services/settings.service';
import { Settings } from '../../common/models/settings';
import { RetroskiDB, RETROSKI_DB } from '../../common/db/db';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonIconComponent, CheckboxComponent, RouterLink, ToolbarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
    private location = inject(Location);
    private router = inject(Router);
    protected settingsService = inject(SettingsService);

    protected settings: Signal<Settings>;

    constructor() {
        this.settings = signal(this.settingsService.getSettings())
    }

    protected goBack(): void {
        this.location.back();
    }

    protected restore(): void {
        this.settingsService.restoreSettings();
        localStorage.clear();
        RETROSKI_DB.delete({disableAutoOpen: false});
        this.router.navigate(['/']);
    }
}
