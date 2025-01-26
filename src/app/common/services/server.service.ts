import { Injectable } from '@angular/core';
import { combineLatest, concatMap, from, map, mergeAll, reduce, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { RecordModel } from 'pocketbase';
import type { User } from '../models/user';
import type { Server } from '../models/server';
import type { ServerRider } from '../models/server-rider';
import type { ServerEvent } from '../models/server-event';
import type { ServerTrack } from '../models/server-track';
import { DateUtils } from '../utils/date.utils';

@Injectable({
    providedIn: 'root'
})
export class ServerService {
    public getServer$(code: string): Observable<Server> {
        return from(environment.pb.collection('servers').getOne(code) as Promise<Server>);
    }

    public createServer$(name: string, user: User): Observable<RecordModel> {
        return from(environment.pb.collection('servers').create({ name: name, owner: user.id }));
    }

    public getUserServers$(): Observable<Server[]> {
        return combineLatest([this.getOwnedServers$(), this.getRiddenServers$()]).pipe(
            map(([owned, ridden]) => [...owned, ...ridden]),
            map(servers => servers.filter((server, index, self) => index === self.findIndex(t => t.id === server.id))),
            mergeAll(),
            concatMap(server => {
                return this.getRiders$(server.id).pipe(
                    map(riders => {
                        server.riders = riders.length;
                        return server;
                    })
                );
            }),
            reduce((acc, server) => [...acc, server], [] as Server[])
        );
    }

    public getEvents$(serverId: string): Observable<ServerEvent[]> {
        return from(
            environment.pb.collection('public_events').getFullList({ query: { server: serverId }, sort: '-created' })
        ).pipe(
            map(records =>
                records.map(record => {
                    const endingDate = record['endingDate'];
                    const endingDateLabel = endingDate
                        ? DateUtils.dateDiffLabel(new Date(endingDate), new Date())
                        : undefined;

                    return {
                        id: record['id'],
                        name: record['name'],
                        racesLimit: record['racesLimit'],
                        startingDate: record['startingDate'],
                        endingDate: record['endingDate'],
                        endingDateLabel: endingDateLabel
                    };
                })
            )
        );
    }

    public addEvent$(
        name: string,
        racesLimit: number,
        serverId: string,
        trackId: string,
        endDate: Date | null
    ): Observable<RecordModel> {
        return from(
            environment.pb.collection('events').create({
                name: name,
                racesLimit: racesLimit,
                server: serverId,
                track: trackId,
                endDate: endDate
            })
        );
    }

    public getRiders$(serverId: string): Observable<ServerRider[]> {
        return from(environment.pb.collection('public_records').getFullList({ query: { server: serverId } })).pipe(
            map(records =>
                records.map(record => {
                    return {
                        name: record['name'],
                        rides: records.filter(r => r['name'] === record['name'])?.length
                    };
                })
            ),
            map(riders => riders.filter((rider, index, self) => index === self.findIndex(t => t.name === rider.name))),
            map(riders => riders.sort((a, b) => b.rides - a.rides))
        );
    }

    public getTracks$(): Observable<ServerTrack[]> {
        return from(environment.pb.collection('tracks').getFullList()).pipe(
            map(records =>
                records.map(record => ({ id: record['id'], name: `${record['name']} - (${record['style']})` }))
            )
        );
    }

    private getRiddenServers$(): Observable<Server[]> {
        return from(environment.pb.collection('public_participations').getFullList()).pipe(
            map(participations =>
                participations.map(participation => {
                    return {
                        id: participation['server'] as string,
                        name: participation['name'] as string,
                        owner: participation['owner'] as string
                    };
                })
            )
        );
    }

    private getOwnedServers$(): Observable<Server[]> {
        return from(environment.pb.collection('servers').getFullList({ sort: '-updated' })).pipe(
            map(servers => servers.map(server => ({ id: server['id'], name: server['name'], owner: server['owner'] })))
        );
    }
}
