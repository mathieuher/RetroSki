import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-button-icon',
  standalone: true,
  imports: [],
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.flipped]': 'flipped()'
  }
})
export class ButtonIconComponent {
    public flipped = input<boolean>();

    public icon = input<string>();
}
