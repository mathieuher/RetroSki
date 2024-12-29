import { format } from 'date-fns';
import type { StockableRecord } from '../../game/models/stockable-record';
import { Config } from '../../game/config';

export class RaceRanking {
    public trackRecords: StockableRecord[];
    public timing: number;
    public penalties: number;

    constructor(trackRecords: StockableRecord[], timing: number, penalties: number) {
        this.trackRecords = trackRecords;
        this.timing = timing;
        this.penalties = penalties;
    }

    public get positionLabel(): string {
        const position = +this.position;
        if (position > 3) {
            return `${position}th`;
        }
        if (position === 3) {
            return `${position}rd`;
        }
        if (position === 2) {
            return `${position}nd`;
        }
        return `${position}st`;
    }

    public getDiffTime(timing: number): string {
        const diff = timing - this.referenceTime;
        return `+${format(diff, diff >= 60000 ? 'mm:ss:SS' : 'ss:SS')}`;
    }

    public get formattedTime(): string {
        return format(this.timing, 'mm:ss:SS');
    }

    public get penaltiesLabel(): string {
        if (this.penalties) {
            if (this.penalties > 1) {
                return `${this.penalties} penalties (+${this.penalties * (Config.MISSED_GATE_PENALTY_TIME / 1000)}s)`;
            }
            return `${this.penalties} penalty (+${Config.MISSED_GATE_PENALTY_TIME / 1000}s)`;
        }
        return '';
    }

    public get position(): number {
        return this.trackRecords.filter(record => record.timing < this.timing).length + 1;
    }

    private get referenceTime(): number {
        return this.trackRecords[0].timing;
    }
}
