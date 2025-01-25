import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../common/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { DatePipe, Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ButtonIconComponent, DatePipe, RouterLink, ToolbarComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
    protected readonly authService = inject(AuthService);

    private readonly router = inject(Router);
    private readonly location = inject(Location);

    protected user = toSignal(this.authService.getRefreshedUser$());
    protected membershipStatus = toSignal(this.authService.getMembershipStatus());
    protected rides = toSignal(this.authService.getRiderRides$(this.authService.getUser()!.id));

    protected logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    protected goBack(): void {
        this.location.back();
    }
}
