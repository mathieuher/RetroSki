export class OnlineEvent {
    public id: string;
    public name: string;
    public racesLimit: number;
    public trackId: string;
    public serverId: string;

    constructor(id: string, name: string, racesLimit: number, serverId: string, trackId: string) {
        this.id = id;
        this.name = name;
        this.racesLimit = racesLimit;
        this.trackId = trackId;
        this.serverId = serverId;
    }
}
