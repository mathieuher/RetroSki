import { Component, inject, input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

@Component({
    selector: 'app-toolbar',
    standalone: true,
    imports: [ButtonIconComponent, RouterLink],
    templateUrl: './toolbar.component.html',
    styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
    protected readonly authService = inject(AuthService);

    public hideSettings = input<boolean>(false);
    public hideProfile = input<boolean>(true);
}
