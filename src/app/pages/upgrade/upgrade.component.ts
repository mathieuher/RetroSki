import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';
import { from, map, takeUntil, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import type { Membership } from '../../common/models/membership';
import { TransactionService } from '../../common/services/transaction.service';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';

@Component({
    selector: 'app-upgrade',
    imports: [ButtonIconComponent, RouterLink, ToolbarComponent],
    templateUrl: './upgrade.component.html',
    styleUrl: './upgrade.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpgradeComponent extends Destroyable {
    private route = inject(ActivatedRoute);
    private transactionService = inject(TransactionService);

    protected readonly transactionDone = (this.route.snapshot.params as { status: 'waiting' }).status === 'waiting';
    protected memberships = toSignal(
        from(environment.pb.collection('memberships').getFullList<Membership>({ sort: 'price' }))
    );

    protected upgrade(membershipId: string): void {
        this.transactionService
            .getPaymentLink$(membershipId)
            .pipe(
                takeUntil(this.destroyed$),
                tap(link => {
                    window.location.href = link;
                })
            )
            .subscribe();
    }
}
