import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  standalone: true,
  imports: [],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonIconComponent {
    public icon = input('');
}
