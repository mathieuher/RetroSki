import { format } from 'date-fns';
import { Config } from '../config';

export class StockableRecord {
    public trackId: number;
    public player: string;
    public date: Date;
    public timing: number;

    constructor(trackId: number, rider: string, date: Date, timing: number) {
        this.trackId = trackId;
        this.player = rider;
        this.date = date;
        this.timing = timing;
    }

    public get formattedTime(): string {
        return format(this.timing, Config.FORMAT_TIMING);
    }
}
