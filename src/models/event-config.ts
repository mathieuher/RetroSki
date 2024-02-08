import { EventRaceResult } from './event-race-result';
import { EventRanking } from './event-ranking';
import { RaceResult } from './race-result';
import { TrackStyles } from './track-styles.enum';

export class EventConfig {
	public eventId: string;
	public trackName: string;
	public trackStyle: TrackStyles;
	public skier1Name: string;
	public skier2Name: string;
	public numberOfRaces: number;
	public racesResults!: EventRaceResult[];

	constructor(
		trackName: string,
		trackStyle: TrackStyles,
		skier1Name: string,
		skier2Name: string,
		numberOfRaces: number,
	) {
		this.eventId = `event${new Date().getTime()}`;
		this.trackName = trackName;
		this.trackStyle = trackStyle;
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
		});
	}

	public getNextRace(): EventRaceResult | null {
		return this.racesResults.find(race => !race.isCompleted()) || null;
	}

	public getActualRankings(): EventRanking[] {
		let skier1Victories = 0;
		let skier2Victories = 0;
		let skier1TotalTiming = 0;
		let skier2TotalTiming = 0;

		for (const raceResult of this.racesResults.filter(result => result.isCompleted())) {
			if (raceResult.getWinner() === this.skier1Name) {
				skier1Victories++;
			} else {
				skier2Victories++;
			}

			skier1TotalTiming += raceResult.skier1Timing!;
			skier2TotalTiming += raceResult.skier2Timing!;
		}

		return [
			new EventRanking(this.skier1Name, skier1Victories, skier1TotalTiming),
			new EventRanking(this.skier2Name, skier2Victories, skier2TotalTiming),
		].sort((s1, s2) => s1.time - s2.time);
	}

	private initRacesResults(numberOfRaces: number): void {
		this.racesResults = [];
		for (let i = 1; i <= numberOfRaces; i++) {
			this.racesResults.push(
				new EventRaceResult(
					this.eventId,
					i,
					this.trackName,
					this.trackStyle,
					this.skier1Name,
					this.skier2Name,
				),
			);
		}
	}
}
