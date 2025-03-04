import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { ButtonIconComponent } from '../../common/components/button-icon/button-icon.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToolbarComponent } from '../../common/components/toolbar/toolbar.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommunityService } from '../../common/services/community.service';
import type { Community } from '../../common/models/community';
import { from, map, takeUntil, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Membership } from '../../common/models/membership';
import { TransactionService } from '../../common/services/transaction.service';
import { Destroyable } from '../../common/components/destroyable/destroyable.component';
import { AuthService } from '../../common/services/auth.service';

@Component({
    selector: 'app-official-community',
    imports: [ButtonIconComponent, RouterLink, ToolbarComponent],
    templateUrl: './official-community.component.html',
    styleUrl: './official-community.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficialCommunityComponent extends Destroyable {
    public communityService = inject(CommunityService);
    private route = inject(ActivatedRoute);
    private transactionService = inject(TransactionService);
    private authService = inject(AuthService);
    private readonly communityId = this.route.snapshot.params['id'];

    protected readonly transactionDone = (this.route.snapshot.params as { status: 'waiting' }).status === 'waiting';
    protected isAuth = toSignal(this.authService.isAuth$());
    protected community: Signal<Community | undefined> = toSignal(
        this.communityService.getCommunity$(this.communityId)
    );

    protected memberships = toSignal(
        from(environment.pb.collection('memberships').getFullList<Membership>({ sort: 'price' })).pipe(
            map(memberships =>
                memberships.map(membership => {
                    membership.description = membership.description.replace('Premium plan', 'Community access');
                    return membership;
                })
            )
        )
    );

    protected upgrade(membershipId: string): void {
        this.transactionService
            .getPaymentLink$(membershipId, this.communityId)
            .pipe(
                takeUntil(this.destroyed$),
                tap(link => {
                    window.location.href = link;
                })
            )
            .subscribe();
    }
}
