import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-academy',
    imports: [ButtonIconComponent, RouterLink, ToolbarComponent],
    templateUrl: './academy.component.html',
    styleUrl: './academy.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcademyComponent {
    public static readonly LESSON_BASICS_COMPLETED_KEY = 'lesson_basics_completed';
    public static readonly LESSON_FASTER_COMPLETED_KEY = 'lesson_faster_completed';
    public static readonly LESSON_PRECISION_COMPLETED_KEY = 'lesson_precision_completed';
    public static readonly LESSON_SLALOM_COMPLETED_KEY = 'lesson_slalom_completed';
    public static readonly LESSON_FINAL_COMPLETED_KEY = 'lesson_final_completed';

    protected racing = signal(false);
    protected basicsCompleted = localStorage.getItem(AcademyComponent.LESSON_BASICS_COMPLETED_KEY) === 'true';
    protected fasterCompleted = localStorage.getItem(AcademyComponent.LESSON_FASTER_COMPLETED_KEY) === 'true';
    protected precisionCompleted = localStorage.getItem(AcademyComponent.LESSON_PRECISION_COMPLETED_KEY) === 'true';
    protected slalomCompleted = localStorage.getItem(AcademyComponent.LESSON_SLALOM_COMPLETED_KEY) === 'true';
    protected testCompleted = localStorage.getItem(AcademyComponent.LESSON_FINAL_COMPLETED_KEY) === 'true';
}
