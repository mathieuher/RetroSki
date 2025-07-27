import { Injectable } from '@angular/core';
import { from, map, tap, type Observable } from 'rxjs';
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
                const results: ChallengeResult[] = [];
                for (const rawResult of rawResults) {
                    const tempResult = ChallengeResult.buildFromRecord(rawResult);
                    const existingResult = results.find(r => r.riderName === tempResult.riderName);
                    if (!existingResult) {
                        results.push(tempResult);
                    } else {
                        existingResult.gold += tempResult.gold;
                        existingResult.silver += tempResult.silver;
                        existingResult.bronze += tempResult.bronze;
                    }
                }
                results.sort(this.sortByMedals);
                return results;
            })
        );
    }

    private sortByMedals(a: ChallengeResult, b: ChallengeResult): 1 | -1 {
        if (a.gold < b.gold) {
            return 1;
        }
        if (a.gold === b.gold) {
            if (a.silver < b.silver) {
                return 1;
            }
            if (a.silver === b.silver) {
                if (a.bronze < b.bronze) {
                    return 1;
                }
                return -1;
            }
            return -1;
        }
        return -1;
    }
}
