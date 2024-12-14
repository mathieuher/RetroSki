import { Injectable } from '@angular/core';
import { from, map, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OnlineEvent } from '../models/online-event';
import { EventResult } from '../models/event-result';
import { EventRanking } from '../models/event-ranking';
import { toDate } from 'date-fns';

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

    public getResults$(eventId: string): Observable<EventResult[]> {
        return from(
            environment.pb.collection('public_records').getFullList({
                query: {
                    event: eventId
                },
                sort: 'updated'
            })
        ).pipe(
            map(records =>
                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                records.map(record => new EventResult(0, record['name'], record['timing'], toDate(record['updated'])))
            ),
            map(records =>
                records.map((record, index) => {
                    const previousRecords = records.filter((r, i) => i < index && r.rider === record.rider);
                    record.rideNumber = previousRecords.length + 1;
                    return record;
                })
            ),
            map(records => records.reverse())
        );
    }

    public buildRankings(raceLimit: number, results: EventResult[]): EventRanking[] {
        if (raceLimit === 0) {
            return this.buildTimeAttackRankings(results);
        }
        return this.buildRaceRankings(raceLimit, results);
    }

    private buildTimeAttackRankings(results: EventResult[]): EventRanking[] {
        const rankings = results
            ?.sort((a, b) => a.time - b.time)
            .map(result => new EventRanking(result.rider, result.time));
        return rankings?.filter((ranking, index) => rankings.findIndex(r => r.name === ranking.name) === index);
    }

    private buildRaceRankings(raceLimit: number, results: EventResult[]): EventRanking[] {
        const completeResults = results?.filter(
            result => results.filter(r => r.rider === result.rider).length === raceLimit
        );
        const rankings = new Map<string, EventRanking>();
        for (const result of completeResults || []) {
            const accumulatedTime = rankings.get(result.rider)?.time ?? 0;
            rankings.set(result.rider, new EventRanking(result.rider, result.time + accumulatedTime));
        }
        return Array.from(rankings.values()).sort((a, b) => a.time - b.time);
    }
}
