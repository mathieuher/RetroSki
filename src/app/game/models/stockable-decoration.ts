export class StockableDecoration {
    public x: number;
    public y: number;
    public type: 'tree';
    public sizeRatio: number;

    constructor(x: number, y: number, type: 'tree', sizeRatio: number) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.sizeRatio = sizeRatio;
    }
}
