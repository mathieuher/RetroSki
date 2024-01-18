export class RecordResult {
    public position: number;
    public player: string;
    public date: string;
    public time: string;
    public difference: string;

    constructor(position: number, player: string, date: string, time: string, difference: string) {
        this.position = position;
        this.player = player;
        this.date = date;
        this.time = time;
        this.difference = difference;
    }
}