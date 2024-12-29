import Dexie, { type Table } from 'dexie';
import type { StockableTrack } from '../../game/models/stockable-track';
import type { StockableGhost } from '../../game/models/stockable-ghost';
import type { StockableRecord } from '../../game/models/stockable-record';

export class RetroskiDB extends Dexie {
    tracks!: Table<StockableTrack, string>;
    ghosts!: Table<StockableGhost, string>;
    records!: Table<StockableRecord, string>;

    constructor() {
        super('retroski');
        this.version(1).stores({
            tracks: '++id, [name+style], builderVersion',
            ghosts: 'trackId, eventId',
            records: '++id, trackId, rider'
        });
        this.on('populate', () => this.populate());
    }

    async populate() {}
}

export const RETROSKI_DB = new RetroskiDB();
