import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { CheckboxComponent } from '../../common/components/checkbox/checkbox.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ButtonIconComponent, CheckboxComponent, RouterLink, ToolbarComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

}
