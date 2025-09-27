import { Injectable } from '@angular/core';
import { from, map, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Challenge } from '../models/challenge';
import { ChallengeResult } from '../models/challenge-result';

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {
    public getChallenge$(id: string): Observable<Challenge> {
        return from(environment.pb.collection('public_challenges').getOne(id)).pipe(
            map(record => Challenge.buildFromRecord(record))
        );
    }

    public getChallenges$(): Observable<Challenge[]> {
        return from(environment.pb.collection('public_challenges').getFullList()).pipe(
            map(challenges => challenges.map(challenge => Challenge.buildFromRecord(challenge)))
        );
    }

    public getChallengResults$(challenge: string): Observable<ChallengeResult[]> {
        return from(
            environment.pb.collection('public_challenges_results').getFullList({ query: { challenge: challenge } })
        ).pipe(
            map(rawResults => {
                const resultsMap = new Map<string, ChallengeResult>();

                for (const rawResult of rawResults) {
                    const tempResult = ChallengeResult.buildFromRecord(rawResult);
                    const existingResult = resultsMap.get(tempResult.riderName);

                    if (!existingResult) {
                        resultsMap.set(tempResult.riderName, tempResult);
                    } else {
                        existingResult.gold += tempResult.gold;
                        existingResult.silver += tempResult.silver;
                        existingResult.bronze += tempResult.bronze;
                    }
                }

                const results = Array.from(resultsMap.values());
                results.sort(this.sortByMedals);
                return results;
            })
        );
    }

    private sortByMedals(a: ChallengeResult, b: ChallengeResult): number {
        const goldDiff = b.gold - a.gold;
        if (goldDiff !== 0) {
            return goldDiff;
        }

        const silverDiff = b.silver - a.silver;
        if (silverDiff !== 0) {
            return silverDiff;
        }

        return b.bronze - a.bronze;
    }
}
