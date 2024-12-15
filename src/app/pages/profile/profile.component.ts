import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../common/services/auth.service';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Location } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [ButtonIconComponent, ToolbarComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
    protected readonly authService = inject(AuthService);

    private readonly router = inject(Router);
    private readonly location = inject(Location);

    protected user = this.authService.getUser();

    protected logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    protected goBack(): void {
        this.location.back();
    }
}
