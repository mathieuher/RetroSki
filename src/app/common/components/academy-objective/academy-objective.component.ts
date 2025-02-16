import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
    selector: 'app-academy-objective',
    imports: [],
    templateUrl: './academy-objective.component.html',
    styleUrl: './academy-objective.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyObjectiveComponent {
    public title = input<string>();
    public detail = input<string>();
    public completed = input<boolean>();
}
