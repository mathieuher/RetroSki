import { Injectable } from '@angular/core';
import { from, last, map, type Observable, of, switchMap, tap } from 'rxjs';
import type { Track } from '../../game/models/track';
import { RETROSKI_DB } from '../db/db';
import { liveQuery } from 'dexie';
import { StockableTrack } from '../../game/models/stockable-track';
import type { TrackStyles } from '../../game/models/track-styles.enum';
import { RaceResult } from '../../game/models/race-result';
import { StockableRecord } from '../../game/models/stockable-record';
import { StockableGhost } from '../../game/models/stockable-ghost';

@Injectable({
    providedIn: 'root'
})
export class TrackService {
    public getTracks$(): Observable<Track[]> {
        return from(liveQuery(() => RETROSKI_DB.tracks.orderBy('name').toArray())).pipe(
            map(tracks => tracks.map(track => Object.assign(new StockableTrack(), track))),
            map(stockableTracks => stockableTracks.map(stockableTrack => stockableTrack.toTrack()))
        );
    }

    public isTrackAvailable$(name: string, style: TrackStyles): Observable<boolean> {
        return from(liveQuery(() => RETROSKI_DB.tracks.where({ name: name ?? '', style: style }).toArray())).pipe(
            map(tracks => tracks.length > 0)
        );
    }

    public getTrack$(trackId: number): Observable<Track> {
        return from(liveQuery(() => RETROSKI_DB.tracks.get(trackId))).pipe(
            map(track => Object.assign(new StockableTrack(), track)),
            map(track => track.toTrack())
        );
    }

    public addTrack$(track: Track): Observable<number> {
        return from(RETROSKI_DB.tracks.add(track.toStockable()));
    }

    public addTrackRecord$(record: StockableRecord): Observable<number> {
        return from(RETROSKI_DB.records.put(record));
    }

    public getTrackRecords$(trackId: number): Observable<StockableRecord[]> {
        return from(liveQuery(() => RETROSKI_DB.records.where({ trackId: trackId }).sortBy('timing'))).pipe(
            map(records =>
                records.map(record => new StockableRecord(record.trackId, record.player, record.date, record.timing))
            )
        );
    }

    public getTrackGhost$(trackId: number): Observable<StockableGhost | undefined> {
        return from(RETROSKI_DB.ghosts.get(trackId)).pipe(
            map(ghost => Object.assign(new StockableGhost(), ghost))
        );
    }

    public updateTrackGhost$(ghost: StockableGhost): Observable<number> {
        return from(RETROSKI_DB.ghosts.put(ghost, ghost.trackId));
    }
}
