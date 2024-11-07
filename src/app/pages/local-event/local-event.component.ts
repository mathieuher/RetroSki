import { Component, inject } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Router, RouterLink } from '@angular/router';
import { RankingLineComponent } from '../../common/components/ranking-line/ranking-line.component';
import { ResultLineComponent } from '../../common/components/result-line/result-line.component';

@Component({
  selector: 'app-local-event',
  standalone: true,
  imports: [ButtonIconComponent, RankingLineComponent, ResultLineComponent, RouterLink, ToolbarComponent],
  templateUrl: './local-event.component.html',
  styleUrl: './local-event.component.scss'
})
export class LocalEventComponent {
    private router = inject(Router);
    
    protected startRace(): void {
        // TODO : Implement
        this.router.navigate(['/race']);
    }
}
