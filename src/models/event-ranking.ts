export class EventRanking {
    public skierName: string;
    public victories: number;
    public time: number

    constructor(skierName: string, victories: number, time: number) {
        this.skierName = skierName;
        this.victories = victories;
        this.time = time;
    }
}