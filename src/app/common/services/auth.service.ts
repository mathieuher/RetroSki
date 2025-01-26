import { Injectable } from '@angular/core';
import { catchError, from, map, of, switchMap, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { RecordAuthResponse, RecordModel } from 'pocketbase';
import { User } from '../models/user';
import { FormatterUtils } from '../utils/formatter.utils';
import { MembershipStatus } from '../models/membership-status';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public isAuth(): boolean {
        return environment.pb.authStore.isValid;
    }

    public logout(): void {
        environment.pb.authStore.clear();
    }

    public isAvailable$(): Observable<boolean> {
        return from(environment.pb.health.check()).pipe(
            map(x => x.code === 200),
            catchError(() => of(false))
        );
    }

    public isAuth$(): Observable<boolean> {
        return from(environment.pb.collection('users').authRefresh()).pipe(map(() => environment.pb.authStore.isValid));
    }

    public login$(email: string, password: string): Observable<RecordAuthResponse> {
        return from(
            environment.pb
                .collection('users')
                .authWithPassword(FormatterUtils.valueFormatter(email, 'lower')!, password)
        );
    }

    public register$(email: string, name: string, password: string): Observable<User> {
        return from(
            environment.pb.collection('users').create({
                email: FormatterUtils.valueFormatter(email, 'lower'),
                name: name,
                password,
                passwordConfirm: password
            })
        ).pipe(
            map(userRecord => User.buildFromRecord(userRecord)),
            map(newUser => {
                newUser.email = email;
                return newUser;
            }),
            switchMap(user => of(this.sendVerificationMail(user.email)).pipe(map(() => user)))
        );
    }

    public getUser(): User | null {
        return environment.pb.authStore.isValid
            ? User.buildFromRecord(environment.pb.authStore.record as RecordModel)
            : null;
    }

    public getRefreshedUser$(): Observable<User | null> {
        return from(environment.pb.collection('users').authRefresh()).pipe(
            map(() => User.buildFromRecord(environment.pb.authStore.record as RecordModel)),
            catchError(() => of(null))
        );
    }

    public sendResetPasswordMail(email: string): Promise<boolean> {
        return environment.pb.collection('users').requestPasswordReset(email);
    }

    public changePassword(password: string, passwordConfirm: string, token: string): Promise<boolean> {
        return environment.pb.collection('users').confirmPasswordReset(token, password, passwordConfirm);
    }

    public verifyUser(token: string): Promise<boolean> {
        return environment.pb.collection('users').confirmVerification(token);
    }

    public getMembershipStatus(): Observable<MembershipStatus> {
        return from(environment.pb.collection('public_active_memberships').getFirstListItem('')).pipe(
            map(response => MembershipStatus.buildFromRecord(response)),
            switchMap(membershipStatus =>
                this.getMembershipName$(membershipStatus.membershipId).pipe(
                    map(membershipName => {
                        membershipStatus.membershipName = membershipName;
                        return membershipStatus;
                    })
                )
            )
        );
    }

    public getRiderRides$(riderId: string): Observable<number> {
        return from(environment.pb.collection('records').getFullList()).pipe(map(response => response.length));
    }

    private getMembershipName$(membershipId: string): Observable<string> {
        return from(environment.pb.collection('memberships').getOne(membershipId)).pipe(
            map(membership => membership['name'])
        );
    }

    private sendVerificationMail(email: string): Promise<boolean> {
        return environment.pb
            .collection('users')
            .requestVerification(email)
            .catch(() => false);
    }
}
