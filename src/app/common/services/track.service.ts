import { Injectable } from '@angular/core';
import { from, map, switchMap, type Observable } from 'rxjs';
import type { Track } from '../../game/models/track';
import { RETROSKI_DB } from '../db/db';
import { StockableTrack } from '../../game/models/stockable-track';
import type { TrackStyles } from '../../game/models/track-styles.enum';
import { StockableRecord } from '../../game/models/stockable-record';
import { StockableGhost } from '../../game/models/stockable-ghost';

@Injectable({
    providedIn: 'root'
})
export class TrackService {
    public getTracks$(): Observable<Track[]> {
        return from(RETROSKI_DB.tracks.orderBy('name').toArray()).pipe(
            map(tracks => tracks.map(track => Object.assign(new StockableTrack(), track))),
            map(stockableTracks => stockableTracks.map(stockableTrack => stockableTrack.toTrack()))
        );
    }

    public isTrackAvailable$(name: string, style: TrackStyles): Observable<boolean> {
        return from(RETROSKI_DB.tracks.where({ name: name ?? '', style: style }).toArray()).pipe(
            map(tracks => tracks.length > 0)
        );
    }

    public addTrack$(track: Track): Observable<number> {
        return from(RETROSKI_DB.tracks.add(track.toStockable()));
    }

    public removeTrack$(track: Track): Observable<Track[]> {
        return from(RETROSKI_DB.tracks.delete(track.id!)).pipe(switchMap(() => this.getTracks$()));
    }

    public addTrackRecord$(record: StockableRecord): Observable<number> {
        return from(RETROSKI_DB.records.put(record));
    }

    public getTrackRecords$(trackId: number): Observable<StockableRecord[]> {
        return from(RETROSKI_DB.records.where({ trackId: trackId }).sortBy('timing')).pipe(
            map(records =>
                records.map(record => new StockableRecord(record.trackId, record.player, record.date, record.timing))
            )
        );
    }

    public getTrackGhost$(trackId: number): Observable<StockableGhost | undefined> {
        return from(RETROSKI_DB.ghosts.get(trackId)).pipe(
            map(ghost => (ghost ? Object.assign(new StockableGhost(), ghost) : undefined))
        );
    }

    public updateTrackGhost$(ghost: StockableGhost): Observable<number> {
        return from(RETROSKI_DB.ghosts.put(ghost, ghost.trackId));
    }
}
