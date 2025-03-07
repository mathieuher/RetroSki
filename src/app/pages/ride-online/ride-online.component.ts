import { ChangeDetectionStrategy, Component, computed, inject, signal, type Signal } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import type { User } from '../../common/models/user';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServerService } from '../../common/services/server.service';
import { catchError, EMPTY, takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import type { Server } from '../../common/models/server';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-ride-online',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, RouterLink, ToolbarComponent],
    templateUrl: './ride-online.component.html',
    styleUrl: './ride-online.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideOnlineComponent extends Destroyable {
    private authService = inject(AuthService);
    private router = inject(Router);
    private serverService = inject(ServerService);

    protected user = this.authService.getUser();
    protected serverCode = new FormControl<string>('', [Validators.required]);
    protected serverName = new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)
    ]);

    private servers = toSignal(this.serverService.getUserServers$());
    protected userServers = computed(() => this.servers()?.filter(s => s.owner === this.user?.id || s.ridden));
    protected publicServers = computed(() => this.servers()?.filter(s => s.public));

    protected connectionError = signal<string | null>(null);
    protected creationError = signal<string | null>(null);

    protected createServer(): void {
        if (this.serverName.valid && this.user) {
            this.serverService
                .createServer$(this.serverName.value!, this.user)
                .pipe(
                    tap(server => this.openServer(server.id)),
                    catchError(() => {
                        this.creationError.set('Unable to create the server');
                        return EMPTY;
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe();
        }
    }

    protected connectServer(): void {
        if (this.serverCode.valid) {
            this.serverService
                .getServer$(this.serverCode.value!)
                .pipe(
                    tap(server => this.openServer(server.id)),
                    catchError(() => {
                        this.connectionError.set('Unable to connect to this server');
                        return EMPTY;
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe();
        }
    }

    protected openServer(serverId: string): void {
        this.router.navigate(['/server', serverId]);
    }
}
