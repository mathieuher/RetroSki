export interface ServerEvent {
    id: string;
    name: string;
    racesLimit: number;
    startingDate?: Date;
    endingDate?: Date;
    endingDateLabel?: string;
}
