import { Component, Signal, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from "./common/components/notification/notification.component";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NotificationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    protected screenCompatible: WritableSignal<boolean>;

    constructor() {
        this.screenCompatible = signal(screen.height >= 500);

        addEventListener('resize', () => this.screenCompatible.set(screen.height >= 500));
    }
}
