import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-ranking-line',
    standalone: true,
    imports: [],
    templateUrl: './ranking-line.component.html',
    styleUrl: './ranking-line.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.current]': 'currentRider()',
        '[class.diff]': 'isDiff()'
    }
})
export class RankingLineComponent {
    public currentRider = input(false);
    public isDiff = input(false);

    public position = input(1);
    public name = input('');
    public time = input('');
}
