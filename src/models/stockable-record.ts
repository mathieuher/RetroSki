export class StockableRecord {
    public player: string;
    public date: Date;
    public timing: number;

    constructor(player: string, date: Date, timing: number) {
        this.player = player;
        this.date = date;
        this.timing = timing;
    }
}