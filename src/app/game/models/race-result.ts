import { StockableGhost } from "./stockable-ghost";

export class RaceResult {
	public rider: string;
	public date: Date;
	public timing: number;
    public missedGates: number;
    public ghost: StockableGhost;

	constructor(rider: string, date: Date, timing: number, missedGates: number, ghost: StockableGhost) {
		this.rider = rider;
		this.date = date;
		this.timing = timing;
        this.missedGates = missedGates;
        this.ghost = ghost;
	}
}
