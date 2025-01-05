import type { RecordModel } from 'pocketbase';

export class User {
    public id: string;
    public name: string;
    public email: string;
    public verified: boolean;
    public premium: boolean;

    constructor(id: string, name: string, email: string, verified: boolean, premium: boolean) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.verified = verified;
        this.premium = premium;
    }

    public static buildFromRecord(record: RecordModel): User {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        return new User(record.id, record['name'], record['email'], record['verified'], record['premium']);
    }
}
