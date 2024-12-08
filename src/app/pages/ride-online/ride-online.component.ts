import { ChangeDetectionStrategy, Component, inject, signal, Signal } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import type { User } from '../../common/models/user';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServerService } from '../../common/services/server.service';
import { takeUntil } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';

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

    protected user: User | null;
    protected serverCode = new FormControl<string>('', [Validators.required]);
    protected serverName = new FormControl<string>('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(16)
    ]);

    constructor() {
        super();
        if (!this.authService.isAuth()) {
            this.router.navigate(['/login']);
        }

        this.user = this.authService.getUser();
    }

    protected createServer(): void {
        if (this.serverName.valid && this.user) {
            this.serverService
                .createServer$(this.serverName.value!, this.user)
                .pipe(takeUntil(this.destroyed$))
                .subscribe();
        }
    }

    protected connectServer(): void {
        if (this.serverCode.valid) {
            this.serverService.getServer$(this.serverCode.value!).pipe(takeUntil(this.destroyed$)).subscribe();
        }
    }
}
