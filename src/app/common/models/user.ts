import type { RecordModel } from 'pocketbase';

export class User {
    public id: string;
    public username: string;
    public email: string;

    constructor(id: string, username: string, email: string) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public static buildFromRecord(record: RecordModel): User {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        return new User(record.id, record['username'], record['email']);
    }
}
