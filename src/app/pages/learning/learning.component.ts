import { Component } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';

@Component({
  selector: 'app-learning',
  standalone: true,
  imports: [ButtonIconComponent, ToolbarComponent],
  templateUrl: './learning.component.html',
  styleUrl: './learning.component.scss'
})
export class LearningComponent {

}
