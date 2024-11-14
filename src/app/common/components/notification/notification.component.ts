import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {}
