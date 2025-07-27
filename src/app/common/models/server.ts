export interface Server {
    id: string;
    name: string;
    owner: string;
    riders?: number;
    ridden?: boolean;
    public?: boolean;
    community?: string;
    challenge?: string;
}
