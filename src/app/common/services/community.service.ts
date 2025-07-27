import { Injectable } from '@angular/core';
import { catchError, concatMap, from, map, mergeAll, of, reduce, tap, type Observable } from 'rxjs';
import { Community } from '../models/community';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CommunityService {
    public getCommunity$(id: string): Observable<Community> {
        return from(environment.pb.collection('public_communities').getOne(id)).pipe(
            map(record => Community.buildFromRecord(record))
        );
    }

    public getCommunities$(): Observable<Community[]> {
        return from(environment.pb.collection('public_communities').getFullList()).pipe(
            map(records => records.map(record => Community.buildFromRecord(record))),
            mergeAll(),
            concatMap(community =>
                this.getCommunityMembers$(community.id).pipe(
                    map(members => {
                        community.members = members;
                        return community;
                    }),
                    catchError(() => of(community))
                )
            ),
            concatMap(community =>
                this.isRiderOfCommunity$(community.id).pipe(
                    map(isRider => {
                        community.userIsMember = isRider;
                        return community;
                    })
                )
            ),
            reduce((acc, community) => [...acc, community], [] as Community[])
        );
    }

    public getUserCommunities$(): Observable<Community[]> {
        return of([]);
    }

    public isRiderOfCommunity$(communityId: string): Observable<boolean> {
        return from(environment.pb.collection('public_active_memberships').getFullList()).pipe(
            map(records => records?.filter(r => r['community'] === communityId)?.length > 0)
        );
    }

    private getCommunityMembers$(id: string): Observable<number> {
        return from(environment.pb.collection('public_communities_members').getOne(id)).pipe(
            map(record => record['users'] as number)
        );
    }
}
