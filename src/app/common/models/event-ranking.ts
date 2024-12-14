import { format } from 'date-fns';
import { Config } from '../../game/config';

export class EventRanking {
    public name: string;
    public time: number;

    constructor(name: string, time: number) {
        this.name = name;
        this.time = time;
    }

    public get formattedTime(): string {
        return format(this.time, Config.FORMAT_TIMING);
    }

    public getDiffTime(reference: number): string {
        const diff = this.time - reference;
        return `+${format(diff, diff >= 60000 ? 'mm:ss:SS' : 'ss:SS')}`;
    }
}
