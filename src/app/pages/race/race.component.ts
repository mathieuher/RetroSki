import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Game } from '../../game/game';

@Component({
  selector: 'app-race',
  standalone: true,
  imports: [],
  templateUrl: './race.component.html',
  styleUrl: './race.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RaceComponent implements OnInit {
    private game?: Game;

    ngOnInit(): void {
        this.game = new Game();
        this.game.initialize();
    }
    
}
