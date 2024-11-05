import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-ride-local',
  standalone: true,
  imports: [ButtonIconComponent, RouterModule, RouterLink, ToolbarComponent],
  templateUrl: './ride-local.component.html',
  styleUrl: './ride-local.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RideLocalComponent {
    private router = inject(Router);

    protected startEvent(): void {
        this.router.navigate(['/local-event']);
    }
}
