import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-upgrade',
    imports: [ButtonIconComponent, RouterLink, ToolbarComponent],
    templateUrl: './upgrade.component.html',
    styleUrl: './upgrade.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpgradeComponent {}
