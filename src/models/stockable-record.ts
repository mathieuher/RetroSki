import { RaceResult } from "./race-result";

export class StockableRecord {
    public player: string;
    public date: Date;
    public timing: number;

    constructor(raceResult: RaceResult) {
        this.player = raceResult.skierName;
        this.date = raceResult.date;
        this.timing = raceResult.timing;
    }
}