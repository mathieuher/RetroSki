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
        return combineLatest([this.getPublicServers$(), this.getOwnedServers$(), this.getRiddenServers$()]).pipe(
            map(([publics, owned, ridden]) => this.combineServers([...publics, ...owned, ...ridden])),
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
            environment.pb
                .collection('public_events')
                .getFullList({ query: { server: serverId }, sort: '-startingDate, -created' })
        ).pipe(
            map(records =>
                records.map(record => {
                    const endingDate = record['endingDate'] ? new Date(record['endingDate']) : undefined;
                    const startingDate = record['startingDate'] ? new Date(record['startingDate']) : undefined;
                    const endingDateLabel = endingDate ? DateUtils.dateDiffLabel(endingDate, new Date()) : undefined;

                    return {
                        id: record['id'],
                        name: record['name'],
                        racesLimit: record['racesLimit'],
                        startingDate: startingDate,
                        endingDate: endingDate,
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
        startingDate: Date | null,
        endingDate: Date | null
    ): Observable<RecordModel> {
        return from(
            environment.pb.collection('events').create({
                name: name,
                racesLimit: racesLimit,
                server: serverId,
                track: trackId,
                startingDate: startingDate,
                endingDate: endingDate
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
        return from(
            environment.pb.collection('public_participations').getFullList({ filter: `server.community = ''` })
        ).pipe(
            map(participations =>
                participations.map(participation => {
                    return {
                        id: participation['server'] as string,
                        name: participation['name'] as string,
                        owner: participation['owner'] as string,
                        ridden: true
                    };
                })
            )
        );
    }

    private getOwnedServers$(): Observable<Server[]> {
        return from(
            environment.pb.collection('servers').getFullList({ filter: `community = ''`, sort: '-updated' })
        ).pipe(
            map(servers =>
                servers.map(server => ({
                    id: server['id'],
                    name: server['name'],
                    owner: server['owner']
                }))
            )
        );
    }

    private getPublicServers$(): Observable<Server[]> {
        return from(environment.pb.collection('public_servers').getFullList()).pipe(
            map(servers =>
                servers.map(server => ({
                    id: server['id'],
                    name: server['name'],
                    owner: server['owner'],
                    public: true
                }))
            )
        );
    }

    private combineServers(servers: Server[]): Server[] {
        const combinedServers: Map<string, Server> = new Map();
        for (const server of servers) {
            const existing = combinedServers.get(server.id);
            if (existing) {
                existing.ridden = existing.ridden || server.ridden;
                existing.public = existing.public || server.public;
                combinedServers.set(existing.id, existing);
            } else {
                combinedServers.set(server.id, server);
            }
        }
        return Array.from(combinedServers.values());
    }
}
