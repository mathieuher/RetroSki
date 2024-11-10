import { format } from 'date-fns';
import type { Track } from '../../game/models/track';
import { Rider } from './rider';
import { Config } from '../../game/config';
import type { StockableGhost } from '../../game/models/stockable-ghost';

export class LocalEventRanking {
    public name: string;
    public time: number;

    constructor(name: string, time: number) {
        this.name = name;
        this.time = time;
    }

    public get formattedTime(): string {
        return format(this.time, Config.FORMAT_TIMING);
    }
}

export class LocalEventResult {
    public rideNumber: number;
    public rider: string;
    public time: number;
    public date: Date;

    constructor(rideNumber: number, rider: string, time: number, date: Date) {
        this.rideNumber = rideNumber;
        this.rider = rider;
        this.time = time;
        this.date = date;
    }

    public get formattedTime(): string {
        return format(this.time, Config.FORMAT_TIMING);
    }
}

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
    public get rankings(): LocalEventRanking[] | undefined {
        if (this.type === 'time-attack') {
            const bestTimeRankings = this.riders
                ?.filter(rider => rider.bestTime)
                .sort((r1, r2) => r1.bestTime! - r2.bestTime!);
            return bestTimeRankings?.map(ranking => new LocalEventRanking(ranking.name!, ranking.bestTime!)) ?? [];
        }

        if (this.raceCounted) {
            const raceRankings = this.riders
                ?.filter(rider => rider.totalTime)
                .sort((r1, r2) => r1.getTimeAfter(this.raceCounted!) - r2.getTimeAfter(this.raceCounted!));
            return raceRankings?.map(
                ranking => new LocalEventRanking(ranking.name!, ranking.getTimeAfter(this.raceCounted!))
            );
        }
        return undefined;
    }

    // All event results from most recent to older
    public get results(): LocalEventResult[] {
        return (
            this.riders
                ?.flatMap(rider => {
                    return rider.results.map((result, index) => {
                        return new LocalEventResult(index + 1, result.rider, result.timing, result.date);
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
