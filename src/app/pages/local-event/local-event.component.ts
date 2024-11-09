import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { Router, RouterLink } from '@angular/router';
import { RankingLineComponent } from '../../common/components/ranking-line/ranking-line.component';
import { ResultLineComponent } from '../../common/components/result-line/result-line.component';
import { LocalEvent, LocalEventRace, LocalEventRanking } from '../../common/models/local-event';
import { LocalEventService } from '../../common/services/local-event.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-local-event',
  standalone: true,
  imports: [ButtonIconComponent, RankingLineComponent, ResultLineComponent, RouterLink, ToolbarComponent],
  templateUrl: './local-event.component.html',
  styleUrl: './local-event.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocalEventComponent {
    protected event: LocalEvent;

    private router = inject(Router);
    private localEventService = inject(LocalEventService);
    
    constructor() {
        this.event = this.localEventService.getEvent()!;
        if(!this.event) {
            this.router.navigate(['/ride-local']);
        }
        
    }
    
    protected startRace(): void {
        // TODO : Implement
        this.router.navigate(['/race']);
    }
}
