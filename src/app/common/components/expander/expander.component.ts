import { ChangeDetectionStrategy, Component, HostBinding, input, model, signal } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

@Component({
    selector: 'app-expander',
    standalone: true,
    imports: [ButtonIconComponent],
    templateUrl: './expander.component.html',
    styleUrl: './expander.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.expanded]': 'expanded()'
    }
})
export class ExpanderComponent {
    public title = input.required<string>();
    public expanded = model<boolean>(false);
}
