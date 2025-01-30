import { format } from 'date-fns';
import { Config } from '../config';

export class StockableRecord {
    public trackId: string;
    public rider: string;
    public date: Date;
    public timing: number;
    public missedGates?: number;
    public avgCheck?: number;

    constructor(trackId: string, rider: string, date: Date, timing: number, missedGates?: number, avgCheck?: number) {
        this.trackId = trackId;
        this.rider = rider;
        this.date = date;
        this.timing = timing;
        this.missedGates = missedGates;
        this.avgCheck = avgCheck;
    }

    public get formattedTime(): string {
        return format(this.timing, Config.FORMAT_TIMING);
    }
}
