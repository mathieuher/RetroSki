export class StockableGate {
	public x: number;
	public y: number;
	public color: 'red' | 'blue';
	public width: number;
	public gateNumber: number;
	public isFinal: boolean;
	public sectorNumber?: number;

	constructor(
		x: number,
		y: number,
		color: 'red' | 'blue',
		width: number,
		gateNumber: number,
		isFinal: boolean,
		sectorNumber?: number,
	) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.width = width;
		this.gateNumber = gateNumber;
		this.isFinal = isFinal;
		this.sectorNumber = sectorNumber;
	}
}
