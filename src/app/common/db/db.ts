import Dexie, { Table } from 'dexie';
import { StockableTrack } from '../../game/models/stockable-track';
import { StockableGhost } from '../../game/models/stockable-ghost';
import { StockableRecord } from '../../game/models/stockable-record';

export class RetroskiDB extends Dexie {
  tracks!: Table<StockableTrack, number>;
  ghosts!: Table<StockableGhost, number>;
  records!: Table<StockableRecord, number>;

  constructor() {
    super('retroski');
    this.version(1).stores({
      tracks: '++id, [name+style], builderVersion',
      ghosts: 'trackId, eventId',
      records: '++id, trackId, rider'
    });
    this.on('populate', () => this.populate());
  }

  async populate() {

  }
}

export const RETROSKI_DB = new RetroskiDB();