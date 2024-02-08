export class RaceResult {
	public raceNumber: number;
	public skierName: string;
	public date: Date;
	public timing: number;

	constructor(raceNumber: number, skierName: string, date: Date, timing: number) {
		this.raceNumber = raceNumber;
		this.skierName = skierName;
		this.date = date;
		this.timing = timing;
	}
}
