import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { RouterLink } from '@angular/router';
import { StepperComponent } from '../../common/components/stepper/stepper.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [ButtonIconComponent, NgTemplateOutlet,  RouterLink, StepperComponent, ToolbarComponent],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LearningComponent {
    protected readonly totalPage = 4;
    protected currentPage = model(1);
    protected currentPageName = computed(() => `page_${this.currentPage()}`);


}
