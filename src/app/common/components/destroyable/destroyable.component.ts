import { Directive, type OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class Destroyable implements OnDestroy {
    protected destroyed$ = new Subject<void>();

    public ngOnDestroy(): void {
        if (this.destroyed$.closed) {
            return;
        }

        this.destroyed$.next();
        this.destroyed$.unsubscribe();
    }
}
