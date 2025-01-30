import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { RouterLink } from '@angular/router';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ExpanderComponent } from '../../common/components/expander/expander.component';

@Component({
    selector: 'app-introduction',
    imports: [ButtonIconComponent, ExpanderComponent, RouterLink, ToolbarComponent, ExpanderComponent],
    templateUrl: './introduction.component.html',
    styleUrl: './introduction.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroductionComponent {}
