import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../common/services/auth.service';
import { from, type Observable, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import type { User } from '../../common/models/user';

@Component({
    selector: 'app-verification',
    imports: [ButtonIconComponent, RouterLink, ToolbarComponent],
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerificationComponent {
    private route = inject(ActivatedRoute);
    private authService = inject(AuthService);

    protected readonly token = (this.route.snapshot.params as { token: string }).token;
    protected verificationDone = toSignal(this.verifyToken(this.token));

    private verifyToken(token: string): Observable<boolean> {
        if (token) {
            return from(this.authService.verifyUser(token));
        }
        return of(false);
    }
}
