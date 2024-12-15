import { ChangeDetectionStrategy, Component, inject, type OnDestroy, signal, type Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { CheckboxComponent } from '../../common/components/checkbox/checkbox.component';
import { Location } from '@angular/common';
import { SettingsService } from '../../common/services/settings.service';
import type { Settings } from '../../common/models/settings';
import { RETROSKI_DB } from '../../common/db/db';
import { AuthService } from '../../common/services/auth.service';
import { User } from '../../common/models/user';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [ButtonIconComponent, CheckboxComponent, ToolbarComponent],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnDestroy {
    private location = inject(Location);
    private router = inject(Router);

    protected authService = inject(AuthService);
    protected settingsService = inject(SettingsService);
    protected settings: Signal<Settings>;

    constructor() {
        this.settings = signal(this.settingsService.getSettings());
    }

    ngOnDestroy(): void {
        this.settingsService.persistSettings();
    }

    protected goBack(): void {
        this.location.back();
    }

    protected restore(): void {
        this.settingsService.resetSettings();
        localStorage.clear();
        RETROSKI_DB.delete({ disableAutoOpen: false });
        window.location.reload();
    }
}
