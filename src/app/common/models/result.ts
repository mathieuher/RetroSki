import { format } from 'date-fns';
import { Config } from '../../game/config';

export class Result {
    public rider: string;
    public date: Date;
    public timing: number;

    constructor(rider: string, date: Date, timing: number) {
        this.rider = rider;
        this.date = date;
        this.timing = timing;
    }
}
