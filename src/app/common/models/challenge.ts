import type { RecordModel } from 'pocketbase';

export class Challenge {
    public name: string;
    public description: string;
    public serverId: string;

    constructor(name: string, description: string, serverId: string) {
        this.name = name;
        this.description = description;
        this.serverId = serverId;
    }

    public static buildFromRecord(record: RecordModel): Challenge {
        return new Challenge(record['name'], record['description'], record['server']);
    }
}
