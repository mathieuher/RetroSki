import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServerService } from '../../common/services/server.service';
import { catchError, EMPTY, takeUntil, tap, timeInterval, timeout } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ExpanderComponent } from '../../common/components/expander/expander.component';
import { CommunityService } from '../../common/services/community.service';
import { ChallengeService } from '../../common/services/challenge.service';

@Component({
    selector: 'app-ride-online',
    standalone: true,
    imports: [ButtonIconComponent, ExpanderComponent, ReactiveFormsModule, RouterLink, ToolbarComponent],
    templateUrl: './ride-online.component.html',
    styleUrl: './ride-online.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideOnlineComponent extends Destroyable {
    private authService = inject(AuthService);
    private router = inject(Router);
    private serverService = inject(ServerService);
    private communityService = inject(CommunityService);
    private challengeService = inject(ChallengeService);

    protected user = this.authService.getUser();
    protected serverCode = new FormControl<string>('', [Validators.required]);
    protected serverName = new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)
    ]);

    private servers = toSignal(this.serverService.getUserServers$().pipe(tap(() => this.serversLoading.set(false))));
    protected serversLoading = signal(true);
    protected communitiesLoading = signal(true);
    protected challengeLoading = signal(true);
    protected userServers = computed(() => this.servers()?.filter(s => s.owner === this.user?.id || s.ridden));
    protected publicServers = computed(() => this.servers()?.filter(s => s.public && !s.challenge));
    protected communities = toSignal(
        this.communityService.getCommunities$().pipe(tap(() => this.communitiesLoading.set(false)))
    );
    protected publicChallenges = toSignal(
        this.challengeService.getChallenges$().pipe(tap(() => this.challengeLoading.set(false)))
    );

    protected connectionError = signal<string | null>(null);
    protected creationError = signal<string | null>(null);

    protected createServer(): void {
        if (this.serverName.valid && this.user) {
            this.serverService
                .createServer$(this.serverName.value!, this.user)
                .pipe(
                    tap(server => this.openServer(server.id)),
                    catchError(() => {
                        this.creationError.set('Unable to create the community');
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
                        this.connectionError.set('Unable to connect to this community');
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
