export class StockableRecord {
	public player: string;
	public date: Date;
	public timing: number;

	constructor(rider: string, date: Date, timing: number) {
		this.player = rider;
		this.date = date;
		this.timing = timing;
	}
}
