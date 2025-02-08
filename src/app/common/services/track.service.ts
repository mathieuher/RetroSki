import { inject, Injectable } from '@angular/core';
import { from, map, of, switchMap, take, type Observable } from 'rxjs';
import type { Track } from '../../game/models/track';
import { RETROSKI_DB } from '../db/db';
import { StockableTrack } from '../../game/models/stockable-track';
import { StockableRecord } from '../../game/models/stockable-record';
import { StockableGhost } from '../../game/models/stockable-ghost';
import type { TrackType } from '../models/track-type';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

interface TrackRecordResponse {
    recordSaved: boolean;
    ghostSaved: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class TrackService {
    private http = inject(HttpClient);

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

    public addTrackRecord$(
        type: TrackType,
        eventId: string,
        record: StockableRecord,
        ghost: StockableGhost
    ): Observable<string | TrackRecordResponse> {
        return type === 'local'
            ? this.addLocalTrackRecord$(record)
            : this.addOnlineTrackRecord$(eventId, record, ghost);
    }

    public updateLocalTrackGhost$(ghost: StockableGhost): Observable<string> {
        return from(RETROSKI_DB.ghosts.put(ghost, ghost.trackId));
    }

    public getTrackRecords$(type: TrackType, trackId: string): Observable<StockableRecord[]> {
        return type === 'local' ? this.getLocalTrackRecords$(trackId) : this.getOnlineTrackRecords$(trackId);
    }

    public getTrackGhost$(type: TrackType, trackId: string, eventId?: string): Observable<StockableGhost | undefined> {
        return type === 'local' ? this.getLocalTrackGhost$(trackId) : this.getOnlineTrackGhost$(trackId, eventId);
    }

    private getLocalTrack$(id: string): Observable<Track> {
        return from(RETROSKI_DB.tracks.get(id)).pipe(
            map(track => Object.assign(new StockableTrack(track!['builderVersion']), track).toTrack())
        );
    }

    private getOnlineTrack$(id: string): Observable<Track> {
        return from(environment.pb.collection('tracks').getOne(id)).pipe(
            map(track => Object.assign(new StockableTrack(track['builderVersion']), track).toTrack())
        );
    }

    private getLocalTracks$(): Observable<Track[]> {
        return from(RETROSKI_DB.tracks.toArray()).pipe(
            map(tracks => tracks.map(track => Object.assign(new StockableTrack(track['builderVersion']), track))),
            map(stockableTracks => stockableTracks.map(stockableTrack => stockableTrack.toTrack()))
        );
    }

    private getOnlineTracks$(): Observable<Track[]> {
        return from(environment.pb.collection('tracks').getFullList({ filter: 'active = true' })).pipe(
            map(tracks => {
                return tracks.map(track => {
                    const stockableTrack = new StockableTrack(track['builderVersion']);
                    stockableTrack.id = track.id;
                    stockableTrack.name = track['name'];
                    stockableTrack.style = track['style'];
                    stockableTrack.gates = track['gates'];
                    stockableTrack.decorations = track['decorations'] || [];
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

    private addOnlineTrackRecord$(
        eventId: string,
        record: StockableRecord,
        ghost: StockableGhost
    ): Observable<TrackRecordResponse> {
        return this.http.post<TrackRecordResponse>(
            `${environment.apiUrl}/track-record`,
            {
                eventId: eventId,
                record: record,
                ghost: ghost
            },
            {
                headers: {
                    Authorization: `Bearer ${environment.pb.authStore.token}`
                }
            }
        );
    }

    private getOnlineTrackRecords$(trackId: string): Observable<StockableRecord[]> {
        return from(
            environment.pb.collection('public_records').getFullList({ query: { track: trackId }, sort: 'timing' })
        ).pipe(
            map(records =>
                records.map(
                    record =>
                        new StockableRecord(trackId, record['name'], new Date(record['updated']), record['timing'])
                )
            )
        );
    }

    private getOnlineTrackGhost$(trackId: string, eventId?: string): Observable<StockableGhost | undefined> {
        const query = { track: trackId, event: eventId || undefined };
        return from(environment.pb.collection('ghosts').getList(1, 1, { query: query, sort: 'totalTime' })).pipe(
            map(records => records.items[0]),
            map(record => {
                if (!record) {
                    return undefined;
                }
                const ghost = new StockableGhost();
                ghost.date = new Date(record['created']);
                ghost.rider = record['rider'];
                ghost.totalTime = record['totalTime'];
                ghost.timedSectors = record['timedSectors'];
                ghost.positions = record['positions'];
                ghost.eventId = record['event'];
                return ghost;
            })
        );
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
                records.map(record => new StockableRecord(record.trackId, record.rider, record.date, record.timing))
            )
        );
    }

    private getLocalTrackGhost$(trackId: string): Observable<StockableGhost | undefined> {
        return from(RETROSKI_DB.ghosts.get(trackId)).pipe(
            map(ghost => (ghost ? Object.assign(new StockableGhost(), ghost) : undefined))
        );
    }
}
