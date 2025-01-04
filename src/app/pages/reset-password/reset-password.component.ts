import { ChangeDetectionStrategy, Component, inject, signal, type Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { emailValidator } from '../login/login.component';
import { AuthService } from '../../common/services/auth.service';

@Component({
    selector: 'app-reset-password',
    imports: [ButtonIconComponent, ReactiveFormsModule, RouterLink, ToolbarComponent],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent {
    private authService = inject(AuthService);
    private route = inject(ActivatedRoute);

    protected mailSent = signal(false);
    protected passwordChanged?: Signal<boolean>;
    protected email = new FormControl('', [Validators.required, emailValidator]);
    protected password = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]);
    protected passwordConfirm = new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(16)
    ]);
    protected readonly token = this.route.snapshot.params['token'];

    protected sendMail(): void {
        if (this.email.valid) {
            this.authService.sendResetPasswordMail(this.email.value!).then(success => {
                if (success) {
                    this.mailSent.set(true);
                    this.email.reset();
                }
            });
        }
    }

    protected changePassword(): void {
        if (
            this.token &&
            this.password.valid &&
            this.passwordConfirm.valid &&
            this.password.value === this.passwordConfirm.value
        ) {
            this.authService
                .changePassword(this.password.value!, this.passwordConfirm.value!, this.token)
                .then(result => {
                    this.passwordChanged = signal(result);
                });
        }
    }
}
