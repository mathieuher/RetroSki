import { Injectable } from '@angular/core';
import { EMPTY, from, map, tap, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { RecordModel } from 'pocketbase';
import { FormatterUtils } from '../utils/formatter.utils';
import type { User } from '../models/user';
import type { Server } from '../models/server';
import type { ServerRider } from '../models/server-rider';
import type { ServerEvent } from '../models/server-event';

@Injectable({
    providedIn: 'root'
})
export class ServerService {
    public getServer$(code: string): Observable<Server> {
        return from(environment.pb.collection('servers').getOne(code) as Promise<Server>);
    }

    public getRiddenServers$(): Observable<Server[]> {
        return from(environment.pb.collection('public_participations').getFullList()).pipe(
            map(participations =>
                participations.map(participation => {
                    return {
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        id: participation['server'] as string,
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        name: participation['name'] as string,
                        owner: ''
                    };
                })
            )
        );
    }

    public createServer$(name: string, user: User): Observable<RecordModel> {
        return from(
            environment.pb
                .collection('servers')
                .create({ name: FormatterUtils.valueFormatter(name, 'name'), owner: user.id })
        );
    }

    public getEvents$(serverId: string): Observable<ServerEvent[]> {
        return from(environment.pb.collection('public_events').getFullList({ query: { server: serverId } })).pipe(
            map(records =>
                records.map(record => {
                    return {
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        id: record['id'],
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        name: record['name'],
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        racesLimit: record['racesLimit']
                    };
                })
            ),
            tap(x => console.log(x))
        );
    }

    public getRiders$(serverId: string): Observable<ServerRider[]> {
        return from(environment.pb.collection('public_records').getFullList({ query: { server: serverId } })).pipe(
            map(records =>
                records.map(record => {
                    return {
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        name: record['name'],
                        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                        rides: records.filter(r => r['name'] === record['name'])?.length
                    };
                })
            ),
            map(riders => riders.filter((rider, index, self) => index === self.findIndex(t => t.name === rider.name))),
            map(riders => riders.sort((a, b) => b.rides - a.rides))
        );
    }
}
