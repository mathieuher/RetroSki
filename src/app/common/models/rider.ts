import type { Result } from './result';

export class Rider {
    public name?: string;
    public results: Result[];

    constructor(name?: string, results?: Result[]) {
        this.name = name;
        this.results = results ?? [];
    }

    public get totalTime(): number {
        return this.results.map(result => result.timing).reduce((acc, curr) => acc + curr) || 0;
    }

    public get bestTime(): number | undefined {
        return this.results.sort((r1, r2) => r1.timing - r2.timing)?.[0].timing;
    }

    public getTimeAfter(race: number): number {
        let time = 0;
        for (let i = 0; i < race; i++) {
            time += this.results[i]?.timing ?? 0;
        }
        return time;
    }

    public get raceCompleted(): number {
        return this.results.length;
    }
}
