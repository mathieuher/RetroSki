import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-button-icon',
    standalone: true,
    imports: [],
    templateUrl: './button-icon.component.html',
    styleUrl: './button-icon.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.flipped]': 'flipped()',
        '[class.hidden]': 'hidden()',
        '[class.rotating]': 'rotating()'
    }
})
export class ButtonIconComponent {
    public hidden = input<boolean>();
    public flipped = input<boolean>();
    public badge = input<string>();
    public icon = input<string>();
    public outlined = input<boolean>();
    public rotating = input<boolean>();
}
