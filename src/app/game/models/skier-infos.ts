export type SkierType = 'academy' | 'race';

export class SkierInfos {
    public name: string;
    public type: SkierType;

    constructor(name: string, type: SkierType) {
        this.name = name;
        this.type = type;
    }
}
