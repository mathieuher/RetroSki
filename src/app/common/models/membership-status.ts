import type { RecordModel } from 'pocketbase';

export class MembershipStatus {
    public membershipId: string;
    public membershipName?: string;
    public startDate: Date;
    public endDate?: Date;

    constructor(membershipId: string, startDate: Date, endDate?: Date, membershipName?: string) {
        this.membershipId = membershipId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.membershipName = membershipName;
    }

    public static buildFromRecord(record: RecordModel): MembershipStatus {
        return new MembershipStatus(
            record['membership'],
            new Date(record['created']),
            record['endDate'] ? new Date(record['endDate']) : undefined,
            record['membershipName']
        );
    }
}
