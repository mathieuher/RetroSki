import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { RouterLink } from '@angular/router';
import { ExpanderComponent } from '../../common/components/expander/expander.component';
import { map, type Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

interface Update {
    date: Date;
    items: string[];
}

@Component({
    selector: 'app-about',
    imports: [ButtonIconComponent, DatePipe, ExpanderComponent, RouterLink, ToolbarComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
    private http = inject(HttpClient);
    protected updates: Signal<Update[] | undefined> = toSignal(this.loadUpdates$());

    private loadUpdates$(): Observable<Update[]> {
        return this.http.get<Update[]>('/assets/files/updates.json').pipe(
            map(files =>
                files.map(file => {
                    file.date = new Date(file.date);
                    return file;
                })
            )
        );
    }
}
