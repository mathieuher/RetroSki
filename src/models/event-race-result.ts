import { TrackStyles } from "./track-styles.enum";

export class EventRaceResult {
    public eventId: string;
    public raceNumber: number;
    public trackName: string;
    public trackStyle: TrackStyles;
    public skier1Name: string;
    public skier2Name: string;
    public skier1Timing?: number;
    public skier2Timing?: number;

    constructor(eventId: string, raceNumber: number, trackName: string, trackStyle: TrackStyles, skier1Name: string, skier2Name: string) {
        this.eventId = eventId;
        this.raceNumber = raceNumber;
        this.trackName = trackName;
        this.trackStyle = trackStyle;
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

    public getFullTrackName(): string {
        return `${this.trackStyle} - ${this.trackName[0].toUpperCase()}${this.trackName.slice(1).toLowerCase()}`;
    }

    public isStarted(): boolean {
        return !!this.skier1Timing || !!this.skier2Timing;
    }

    public isCompleted(): boolean {
        return !!this.skier1Timing && !!this.skier2Timing;
    }
}