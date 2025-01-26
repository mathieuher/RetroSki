export class OnlineEvent {
    public id: string;
    public name: string;
    public racesLimit: number;
    public trackId: string;
    public serverId: string;
    public endingDate?: Date;
    public startingDate?: Date;

    constructor(
        id: string,
        name: string,
        racesLimit: number,
        serverId: string,
        trackId: string,
        endingDate?: Date,
        startingDate?: Date
    ) {
        this.id = id;
        this.name = name;
        this.racesLimit = racesLimit;
        this.trackId = trackId;
        this.serverId = serverId;
        this.endingDate = endingDate;
        this.startingDate = startingDate;
    }

    public get isClosed(): boolean {
        return (this.endingDate?.getTime() || 0) < new Date().getTime();
    }
}
