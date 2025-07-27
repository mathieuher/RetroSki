import type { RecordModel } from 'pocketbase';
import { environment } from '../../../environments/environment';

export type CommunityType = 'skier' | 'gamer';
type Sexe = 'man' | 'woman';

export class Community {
    public id: string;
    public firstname: string;
    public lastname: string;
    public description: string;
    public picture: string;
    public type: CommunityType;
    public sexe: Sexe;
    public serverId: string;
    public members?: number;
    public userIsMember?: boolean;

    constructor(
        id: string,
        firstname: string,
        lastname: string,
        description: string,
        picture: string,
        type: CommunityType,
        sexe: Sexe,
        serverId: string
    ) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.description = description;
        this.picture = picture;
        this.type = type;
        this.sexe = sexe;
        this.serverId = serverId;
    }

    public static buildFromRecord(record: RecordModel): Community {
        return new Community(
            record.id,
            record['firstname'],
            record['lastname'],
            record['description'],
            Community.buildFullPictureUrl(record.id, record['picture']),
            record['type'],
            record['sexe'],
            record['server']
        );
    }

    private static buildFullPictureUrl(communityId: string, picture: string): string {
        return `${environment.apiUrl}/files/communities/${communityId}/${picture}?thumb=100x100`;
    }
}
