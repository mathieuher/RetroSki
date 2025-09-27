import { Injectable } from '@angular/core';
import { from, map, tap, type Observable } from 'rxjs';
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
                    new OnlineEvent(
                        record.id,
                        record['name'],
                        record['racesLimit'],
                        record['server'],
                        record['track'],
                        record['endingDate'] ? new Date(record['endingDate']) : undefined,
                        record['startingDate'] ? new Date(record['startingDate']) : undefined
                    )
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
            map(records => {
                const rideCounts = new Map<string, number>();
                const eventResults = records.map(record => {
                    const riderName = record['name'];
                    const currentRideCount = rideCounts.get(riderName) ?? 0;
                    rideCounts.set(riderName, currentRideCount + 1);
                    return new EventResult(
                        currentRideCount + 1,
                        riderName,
                        record['timing'],
                        toDate(record['updated'])
                    );
                });
                return eventResults.reverse();
            })
        );
    }

    public buildRankings(raceLimit: number, results: EventResult[]): EventRanking[] {
        if (raceLimit === 0) {
            return this.buildTimeAttackRankings(results);
        }
        return this.buildRaceRankings(raceLimit, results);
    }

    private buildTimeAttackRankings(results: EventResult[]): EventRanking[] {
        if (!results) return [];
        const sortedResults = results.sort((a, b) => a.time - b.time);
        const bestTimeMap = new Map<string, EventRanking>();

        for (const result of sortedResults) {
            if (!bestTimeMap.has(result.rider)) {
                bestTimeMap.set(result.rider, new EventRanking(result.rider, result.time));
            }
        }
        return Array.from(bestTimeMap.values());
    }

    private buildRaceRankings(raceLimit: number, results: EventResult[]): EventRanking[] {
        if (!results) return [];

        const rideCounts = new Map<string, number>();
        const totalTimes = new Map<string, number>();

        for (const result of results) {
            const currentCount = rideCounts.get(result.rider) ?? 0;
            rideCounts.set(result.rider, currentCount + 1);

            const accumulatedTime = totalTimes.get(result.rider) ?? 0;
            totalTimes.set(result.rider, accumulatedTime + result.time);
        }

        const rankings: EventRanking[] = [];

        for (const [riderId, count] of rideCounts.entries()) {
            if (count === raceLimit) {
                const finalTime = totalTimes.get(riderId) ?? 0;
                rankings.push(new EventRanking(riderId, finalTime));
            }
        }

        return rankings.sort((a, b) => a.time - b.time);
        /*
        const completeResults = results?.filter(
            result => results.filter(r => r.rider === result.rider).length === raceLimit
        );
        const rankings = new Map<string, EventRanking>();
        for (const result of completeResults || []) {
            const accumulatedTime = rankings.get(result.rider)?.time ?? 0;
            rankings.set(result.rider, new EventRanking(result.rider, result.time + accumulatedTime));
        }
        return Array.from(rankings.values()).sort((a, b) => a.time - b.time);
        */
    }
}
