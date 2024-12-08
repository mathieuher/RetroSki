import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Router, RouterLink } from '@angular/router';
import {
    type AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    type ValidationErrors,
    type ValidatorFn,
    Validators
} from '@angular/forms';
import { AuthService } from '../../common/services/auth.service';
import { catchError, of, switchMap, takeUntil, tap } from 'rxjs';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';

interface LoginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

interface RegisterForm extends LoginForm {
    name: FormControl<string | null>;
}

const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    let email: string = control?.value;
    if (email?.length) {
        const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

        email = email.split(' ').join('');
        return email.match(regex) ? null : { emailFormat: "Le format de l'adresse email n'est pas valide" };
    }
    return null;
};

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonIconComponent, ReactiveFormsModule, RouterLink, ToolbarComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent extends Destroyable {
    private authService = inject(AuthService);
    private router = inject(Router);

    protected loginForm!: FormGroup<LoginForm>;
    protected registerForm!: FormGroup<RegisterForm>;

    protected loginError = signal<string | null>(null);
    protected registerError = signal<string | null>(null);

    constructor() {
        super();

        if (this.authService.isAuth()) {
            this.router.navigate(['/ride-online']);
        }

        this.initForms();
    }

    private initForms(): void {
        this.loginForm = new FormGroup<LoginForm>({
            email: new FormControl('', [Validators.required, emailValidator]),
            password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
        });

        this.registerForm = new FormGroup<RegisterForm>({
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(16)]),
            email: new FormControl('', [Validators.required, emailValidator]),
            password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
        });
    }

    protected login(): void {
        if (this.loginForm.valid) {
            this.loginError.set(null);
            this.authService
                .login$(this.loginForm.value.email!, this.loginForm.value.password!)
                .pipe(
                    tap(() => this.router.navigate(['/ride-online'])),
                    catchError(() => {
                        this.loginError.set('Invalid email or password');
                        return of(null);
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe();
        }
    }

    protected register(): void {
        if (this.registerForm.valid) {
            this.registerError.set(null);
            const values = this.registerForm.value;
            this.authService
                .register$(values.email!, values.name!, values.password!)
                .pipe(
                    switchMap(() => this.authService.login$(values.email!, values.password!)),
                    tap(() => this.router.navigate(['/ride-online'])),
                    catchError(error => {
                        const errorData = error.data.data;
                        if (errorData?.email) {
                            this.registerError.set('Email already used');
                        } else if (errorData?.name) {
                            this.registerError.set('Username already used');
                        } else {
                            this.registerError.set('An error occurred');
                        }
                        return of(null);
                    }),
                    takeUntil(this.destroyed$)
                )
                .subscribe();
        }
    }
}
