import { EventRaceResult } from "./event-race-result";
import { RaceResult } from "./race-result";

export class EventConfig {
    public trackName: string;
    public skier1Name: string;
    public skier2Name: string;
    public numberOfRaces: number;
    public racesResults!: EventRaceResult[];

    constructor(trackName: string, skier1Name: string, skier2Name: string, numberOfRaces: number) {
        this.trackName = trackName;
        this.skier1Name = skier1Name;
        this.skier2Name = skier2Name;
        this.numberOfRaces = numberOfRaces;
        this.initRacesResults(numberOfRaces);
    }

    public updateRaceResult(raceResult: RaceResult) {
        this.racesResults = this.racesResults.map(result => {
            if (result.raceNumber === raceResult.raceNumber) {
                result.setTiming(raceResult.skierName, raceResult.timing);
            }
            return result;
        })
    }

    public getNextRace(): EventRaceResult | null {
        return this.racesResults.find(race => !race.isCompleted()) || null;
    }

    private initRacesResults(numberOfRaces: number): void {
        this.racesResults = [];
        for (let i = 1; i <= numberOfRaces; i++) {
            this.racesResults.push(new EventRaceResult(i, this.trackName, this.skier1Name, this.skier2Name));
        }
    }
}