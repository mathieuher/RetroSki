import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';
import { ButtonIconComponent } from '../button-icon/button-icon.component';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [ButtonIconComponent],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepperComponent {
    public currentStep = model(1);
    public totalStep = input(1);
}
