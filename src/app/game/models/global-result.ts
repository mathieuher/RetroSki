import { RecordResult } from "./record-result";

export class GlobalResult {
    public records: RecordResult[];
    public position: number;

    constructor(records: RecordResult[], position: number) {
        this.records = records;
        this.position = position;
    }
}