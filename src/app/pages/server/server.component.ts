import { ChangeDetectionStrategy, Component, computed, inject, signal, type WritableSignal } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import type { RecordModel } from 'pocketbase';
import type { Server } from '../../common/models/server';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ServerService } from '../../common/services/server.service';
import type { ServerRider } from '../../common/models/server-rider';
import { AuthService } from '../../common/services/auth.service';
import type { ServerEvent } from '../../common/models/server-event';

@Component({
    selector: 'app-server',
    standalone: true,
    imports: [ToolbarComponent, ButtonIconComponent, RouterLink],
    templateUrl: './server.component.html',
    styleUrl: './server.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServerComponent {
    private readonly authService = inject(AuthService);
    private readonly route = inject(ActivatedRoute);
    private readonly serverService = inject(ServerService);
    private readonly serverId = this.route.snapshot.params['id'];
    private readonly router = inject(Router);

    protected server = signal<Server | null>(null);
    protected readonly now = new Date().getTime();
    protected riders = signal<ServerRider[] | null>(null);
    protected activeRiders = computed(() => this.riders()?.slice(0, 5));
    protected events = signal<ServerEvent[] | null>(null);
    protected activeEvents = computed(() =>
        this.events()?.filter(event => {
            return (
                (!event.endingDate || event.endingDate.getTime() > this.now) &&
                (!event.startingDate || event.startingDate.getTime() < this.now)
            );
        })
    );
    protected user = this.authService.getUser();
    protected ridersDisplay: WritableSignal<'active' | 'all'> = signal('active');
    protected eventsDisplay: WritableSignal<'active' | 'all'> = signal('active');

    constructor() {
        this.serverService
            .getServer$(this.serverId)
            .pipe(
                tap(server => {
                    if (!server) {
                        this.router.navigate(['/ride-online']);
                    } else {
                        this.server.set(server);
                    }
                }),
                switchMap(() => this.serverService.getRiders$(this.serverId)),
                tap(riders => this.riders.set(riders)),
                switchMap(() => this.serverService.getEvents$(this.serverId)),
                tap(events => this.events.set(events)),
                takeUntilDestroyed()
            )
            .subscribe();
    }

    protected shareServer() {
        navigator
            .share({
                title: "Let's ride on RetroSki",
                text: `A RetroSki server is live, and you’re invited to hit the slopes! 🎿\nClick the link to join the server or use the server code :\n\n${this.serverId}\n\nRace, challenge your friends, or simply enjoy the ride on some of the most exciting 2D alpine tracks.\nDon’t miss out, see you on the mountain! 🏁`,
                url: window.location.href
            })
            .catch(() => void 0);
    }
}
