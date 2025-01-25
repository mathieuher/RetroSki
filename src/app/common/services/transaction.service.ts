import { inject, Injectable } from '@angular/core';
import { map, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http = inject(HttpClient);

    public getPaymentLink$(membershipId: string): Observable<string> {
        const headers = {
            Authorization: `Bearer ${environment.pb.authStore.token}`
        };

        return this.http
            .post<{ link: string }>(
                `${environment.apiUrl}/payment-link`,
                { membershipId: membershipId },
                { headers: headers }
            )
            .pipe(map(response => response.link));
    }
}
