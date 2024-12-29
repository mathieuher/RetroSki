import { format } from 'date-fns';
import { Config } from '../../game/config';

export class EventResult {
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
