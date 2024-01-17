export class EventRaceResult {
    public raceNumber: number;
    public trackName: string;
    public skier1Name: string;
    public skier2Name: string;
    public skier1Timing?: number;
    public skier2Timing?: number;

    constructor(raceNumber: number, trackName: string, skier1Name: string, skier2Name: string) {
        this.raceNumber = raceNumber;
        this.trackName = trackName;
        this.skier1Name = skier1Name;
        this.skier2Name = skier2Name;
    }

    public getWinner(): string | null {
        return !this.isCompleted() ? null : this.skier1Timing! < this.skier2Timing! ? this.skier1Name : this.skier2Name;
    }

    public getNextSkierName(): string | null {
        return this.isCompleted() ? null : this.skier1Timing ? this.skier2Name : this.skier1Name;
    }

    public setTiming(skierName: string, timing: number): boolean {
        if (skierName === this.skier1Name) {
            this.skier1Timing = timing;
        } else if (skierName === this.skier2Name) {
            this.skier2Timing = timing;
        }

        return this.isCompleted();
    }

    public isStarted(): boolean {
        return !!this.skier1Timing || !!this.skier2Timing;
    }

    public isCompleted(): boolean {
        return !!this.skier1Timing && !!this.skier2Timing;
    }
}