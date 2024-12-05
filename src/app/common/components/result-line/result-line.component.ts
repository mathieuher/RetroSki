import { ChangeDetectionStrategy, Component, computed, input, Input } from '@angular/core';

@Component({
    selector: 'app-result-line',
    standalone: true,
    imports: [],
    templateUrl: './result-line.component.html',
    styleUrl: './result-line.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.current]': 'current()'
    }
})
export class ResultLineComponent {
    public current = input<boolean>();
    public type = input<'race' | 'time-attack'>();
    public rideNumber = input<number>();
    public ridePosition = input<number>();
    public name = input<string>();
    public time = input<string>();

    protected rideLabel = computed(() => {
        return this.type() === 'race' ? `Race ${this.rideNumber()}.` : `Try ${this.rideNumber()}.`;
    });
}
