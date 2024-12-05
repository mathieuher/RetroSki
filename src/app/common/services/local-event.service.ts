import { Injectable } from '@angular/core';
import { LocalEvent } from '../models/local-event';
import { Rider } from '../models/rider';
import type { Track } from '../../game/models/track';
import type { RaceResult } from '../../game/models/race-result';
import { Result } from '../models/result';
import type { StockableGhost } from '../../game/models/stockable-ghost';

@Injectable({
    providedIn: 'root'
})
export class LocalEventService {
    private currentEvent?: LocalEvent;

    public getEvent(): LocalEvent | undefined {
        return this.currentEvent;
    }

    public newEvent(track: Track, riders: string[], racesLimit?: number): LocalEvent {
        this.currentEvent = new LocalEvent(
            track,
            riders.map(rider => new Rider(rider)),
            racesLimit
        );
        return this.currentEvent;
    }

    public addEventResult(result: RaceResult): void {
        this.currentEvent!.riders = this.currentEvent!.riders!.map(rider => {
            if (rider.name !== result.rider) {
                return rider;
            }
            rider.results.push(new Result(result.rider, result.date, result.timing));
            return rider;
        });
    }

    public updateEventGhost(ghost: StockableGhost): void {
        this.currentEvent!.ghost = ghost;
    }
}
