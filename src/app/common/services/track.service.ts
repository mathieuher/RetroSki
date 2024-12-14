import { Injectable } from '@angular/core';
import { from, map, of, switchMap, type Observable } from 'rxjs';
import type { Track } from '../../game/models/track';
import { RETROSKI_DB } from '../db/db';
import { StockableTrack } from '../../game/models/stockable-track';
import { StockableRecord } from '../../game/models/stockable-record';
import { StockableGhost } from '../../game/models/stockable-ghost';
import type { TrackType } from '../models/track-type';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TrackService {
    public getTrack$(type: TrackType, id: string): Observable<Track> {
        if (type === 'local') {
            return this.getLocalTrack$(id);
        }
        return this.getOnlineTrack$(id);
    }

    public getTracks$(type: TrackType): Observable<Track[]> {
        const tracks = type === 'local' ? this.getLocalTracks$() : this.getOnlineTracks$();
        return tracks.pipe(map(tracks => tracks.sort((a, b) => a.name.localeCompare(b.name))));
    }

    public addTrack$(type: TrackType, track: Track): Observable<string> {
        return type === 'local' ? this.addLocalTrack$(track) : this.addOnlineTrack$(track);
    }

    public removeTrack$(type: TrackType, track: Track): Observable<Track[]> {
        return type === 'local' ? this.removeLocalTrack$(track) : this.removeOnlineTrack$(track);
    }

    public addTrackRecord$(type: TrackType, record: StockableRecord): Observable<string> {
        return type === 'local' ? this.addLocalTrackRecord$(record) : this.addOnlineTrackRecord$(record);
    }

    public getTrackRecords$(type: TrackType, trackId: string): Observable<StockableRecord[]> {
        return type === 'local' ? this.getLocalTrackRecords$(trackId) : this.getOnlineTrackRecords$(trackId);
    }

    public getTrackGhost$(type: TrackType, trackId: string): Observable<StockableGhost | undefined> {
        return type === 'local' ? this.getLocalTrackGhost$(trackId) : this.getOnlineTrackGhost$(trackId);
    }

    public updateTrackGhost$(type: TrackType, ghost: StockableGhost): Observable<string> {
        return type === 'local' ? this.updateLocalTrackGhost$(ghost) : this.updateOnlineTrackGhost$(ghost);
    }

    private getLocalTrack$(id: string): Observable<Track> {
        return from(RETROSKI_DB.tracks.get(id)).pipe(
            map(track => Object.assign(new StockableTrack(), track).toTrack())
        );
    }

    private getOnlineTrack$(id: string): Observable<Track> {
        return from(environment.pb.collection('tracks').getOne(id)).pipe(
            map(track => Object.assign(new StockableTrack(), track).toTrack())
        );
    }

    private getLocalTracks$(): Observable<Track[]> {
        return from(RETROSKI_DB.tracks.toArray()).pipe(
            map(tracks => tracks.map(track => Object.assign(new StockableTrack(), track))),
            map(stockableTracks => stockableTracks.map(stockableTrack => stockableTrack.toTrack()))
        );
    }

    private getOnlineTracks$(): Observable<Track[]> {
        return from(environment.pb.collection('tracks').getFullList({ filter: 'active = true' })).pipe(
            map(tracks => {
                return tracks.map(track => {
                    const stockableTrack = new StockableTrack();
                    stockableTrack.id = track.id;
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    stockableTrack.name = track['name'];
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    stockableTrack.style = track['style'];
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    stockableTrack.builderVersion = track['builderVersion'];
                    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                    stockableTrack.gates = track['gates'];
                    return stockableTrack.toTrack();
                });
            })
        );
    }

    private addOnlineTrack$(track: Track): Observable<string> {
        return from(environment.pb.collection('tracks').create(track.toStockable())).pipe(map(track => track.id));
    }

    private removeOnlineTrack$(track: Track): Observable<Track[]> {
        return from(
            environment.pb.collection('tracks').update(track.id!, {
                active: false
            })
        ).pipe(switchMap(() => this.getTracks$('online')));
    }

    private addOnlineTrackRecord$(record: StockableRecord): Observable<string> {
        // TODO
        return of('');
    }

    private getOnlineTrackRecords$(trackId: string): Observable<StockableRecord[]> {
        // TODO
        return of([]);
    }

    private getOnlineTrackGhost$(trackId: string): Observable<StockableGhost | undefined> {
        // TODO
        return of(undefined);
    }

    private updateOnlineTrackGhost$(ghost: StockableGhost): Observable<string> {
        // TODO
        return of('');
    }

    private addLocalTrack$(track: Track): Observable<string> {
        return from(RETROSKI_DB.tracks.add(track.toStockable()));
    }

    private removeLocalTrack$(track: Track): Observable<Track[]> {
        return from(RETROSKI_DB.tracks.delete(track.id!)).pipe(switchMap(() => this.getTracks$('local')));
    }

    private addLocalTrackRecord$(record: StockableRecord): Observable<string> {
        return from(RETROSKI_DB.records.put(record));
    }

    private getLocalTrackRecords$(trackId: string): Observable<StockableRecord[]> {
        return from(RETROSKI_DB.records.where({ trackId: trackId }).sortBy('timing')).pipe(
            map(records =>
                records.map(record => new StockableRecord(record.trackId, record.player, record.date, record.timing))
            )
        );
    }

    private getLocalTrackGhost$(trackId: string): Observable<StockableGhost | undefined> {
        return from(RETROSKI_DB.ghosts.get(trackId)).pipe(
            map(ghost => (ghost ? Object.assign(new StockableGhost(), ghost) : undefined))
        );
    }

    private updateLocalTrackGhost$(ghost: StockableGhost): Observable<string> {
        return from(RETROSKI_DB.ghosts.put(ghost, ghost.trackId));
    }
}
