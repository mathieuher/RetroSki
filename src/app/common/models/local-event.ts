import { format } from 'date-fns';
import type { Track } from '../../game/models/track';
import { Rider } from './rider';
import { Config } from '../../game/config';
import type { StockableGhost } from '../../game/models/stockable-ghost';
import { EventResult } from './event-result';
import { EventRanking } from './event-ranking';

export class LocalEventRace {
    public rider: string;
    public track: Track;
    public raceNumber: number;

    constructor(rider: string, track: Track, raceNumber: number) {
        this.rider = rider;
        this.track = track;
        this.raceNumber = raceNumber;
    }
}

export class LocalEvent {
    public id: string;
    public racesLimit?: number;
    public track?: Track;
    public riders?: Rider[];
    public ghost?: StockableGhost;

    constructor(track?: Track, riders?: Rider[], racesLimit?: number) {
        this.id = `local-event:${new Date().getTime()}`;
        this.track = track;
        this.riders = riders ?? [new Rider()];
        this.racesLimit = racesLimit ?? 2;
    }

    // How many race are done by all the riders
    public get raceCounted(): number | undefined {
        let raceCounted = this.racesLimit;
        for (const rider of this.riders!) {
            if (rider.results.length < raceCounted!) {
                raceCounted = rider.results.length;
            }
        }
        return raceCounted;
    }

    // Current ranking of the event : Time-attack or Race
    public get rankings(): EventRanking[] | undefined {
        if (this.type === 'time-attack') {
            const bestTimeRankings = this.riders
                ?.filter(rider => rider.bestTime)
                .sort((r1, r2) => r1.bestTime! - r2.bestTime!);
            return bestTimeRankings?.map(ranking => new EventRanking(ranking.name!, ranking.bestTime!)) ?? [];
        }

        if (this.raceCounted) {
            const raceRankings = this.riders
                ?.filter(rider => rider.totalTime)
                .sort((r1, r2) => r1.getTimeAfter(this.raceCounted!) - r2.getTimeAfter(this.raceCounted!));
            return raceRankings?.map(
                ranking => new EventRanking(ranking.name!, ranking.getTimeAfter(this.raceCounted!))
            );
        }
        return undefined;
    }

    // All event results from most recent to older
    public get results(): EventResult[] {
        return (
            this.riders
                ?.flatMap(rider => {
                    return rider.results.map((result, index) => {
                        return new EventResult(index + 1, result.rider, result.timing, result.date);
                    });
                })
                .sort((r1, r2) => (r1.date < r2.date ? 1 : -1)) ?? []
        );
    }

    public get incomingRaces(): LocalEventRace[] {
        return (
            this.riders
                ?.flatMap(rider => this.generateIncomingRace(rider, this.track!, this.racesLimit!))
                .sort((r1, r2) => r1.raceNumber - r2.raceNumber) ?? []
        );
    }

    private generateIncomingRace(rider: Rider, track: Track, races: number): LocalEventRace[] {
        const incomingRaces = [];
        for (let i = 0; i < races; i++) {
            if (rider.results.length <= i) {
                incomingRaces.push(new LocalEventRace(rider.name!, track, i + 1));
            }
        }
        return incomingRaces;
    }

    public get type(): 'time-attack' | 'race' {
        return this.racesLimit !== undefined ? 'race' : 'time-attack';
    }
}
