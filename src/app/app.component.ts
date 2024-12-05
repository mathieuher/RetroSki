import { Component, inject, type Signal, signal, type WritableSignal } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { NotificationComponent } from './common/components/notification/notification.component';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NotificationComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    protected screenCompatible: WritableSignal<boolean>;
    protected routeLoading: Signal<boolean | undefined>;
    private router = inject(Router);

    constructor() {
        this.routeLoading = toSignal(
            this.router.events.pipe(
                filter(event => event instanceof RouteConfigLoadStart || event instanceof RouteConfigLoadEnd),
                map(event => event instanceof RouteConfigLoadStart),
                takeUntilDestroyed()
            )
        );

        this.screenCompatible = signal(screen.height >= 500);

        addEventListener('resize', () => this.screenCompatible.set(screen.height >= 500));
    }
}
