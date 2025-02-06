import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink, ToolbarComponent, ButtonIconComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {}
