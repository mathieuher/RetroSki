import { Injectable } from '@angular/core';
import { from, map, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OnlineEvent } from '../models/online-event';

@Injectable({
    providedIn: 'root'
})
export class EventService {

    public getEvent$(id: string): Observable<OnlineEvent> {
        return from(environment.pb.collection('events').getOne(id)).pipe(
            map(
                record =>
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    new OnlineEvent(record.id, record['name'], record['racesLimit'], record['server'], record['track'])
            )
        );
    }
}
