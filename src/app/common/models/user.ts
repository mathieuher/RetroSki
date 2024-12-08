import type { RecordModel } from 'pocketbase';

export class User {
    public id: string;
    public name: string;
    public email: string;

    constructor(id: string, name: string, email: string) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public static buildFromRecord(record: RecordModel): User {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        return new User(record.id, record['name'], record['email']);
    }
}
