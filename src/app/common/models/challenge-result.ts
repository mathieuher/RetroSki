import type { RecordModel } from 'pocketbase';

export class ChallengeResult {
    public riderName: string;
    public gold: number;
    public silver: number;
    public bronze: number;

    constructor(riderName: string, gold: number, silver: number, bronze: number) {
        this.riderName = riderName;
        this.gold = gold;
        this.silver = silver;
        this.bronze = bronze;
    }

    public static buildFromRecord(record: RecordModel) {
        const position = record['position'];
        return new ChallengeResult(
            record['name'],
            position === 1 ? 1 : 0,
            position === 2 ? 1 : 0,
            position === 3 ? 1 : 0
        );
    }
}
