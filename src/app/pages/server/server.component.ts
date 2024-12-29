import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    private readonly serverId = this.route.snapshot.params['id'];
    private readonly router = inject(Router);

    protected server = signal<Server | null>(null);
    protected riders = signal<ServerRider[] | null>(null);
    protected events = signal<ServerEvent[] | null>(null);
    protected user = this.authService.getUser();

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
                title: 'RetroSki invitation',
                text: `Come ride with us by clicking on the link or using the server access code : ${this.serverId}`,
                url: window.location.href
            })
            .catch(() => void 0);
    }
}
