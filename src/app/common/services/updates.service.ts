import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, type Observable, of } from 'rxjs';

export interface Update {
    date: Date;
    items: string[];
}

@Injectable({
    providedIn: 'root'
})
export class UpdatesService {
    private static readonly LAST_CONSULTED_DATE_KEY = 'last_consulted_date';
    private http = inject(HttpClient);

    public getUpdates$(): Observable<Update[]> {
        return this.http.get<Update[]>('/assets/files/updates.json').pipe(
            map(files =>
                files.map(file => {
                    file.date = new Date(file.date);
                    return file;
                })
            )
        );
    }

    public getLastUpdateDate$(): Observable<Date> {
        return this.getUpdates$().pipe(map(updates => updates[0].date));
    }

    public getLastConsultedDate(): Date | null {
        const storedDate = localStorage.getItem(UpdatesService.LAST_CONSULTED_DATE_KEY);
        return storedDate ? new Date(+storedDate) : null;
    }

    public setLastConsultedDate(): void {
        localStorage.setItem(UpdatesService.LAST_CONSULTED_DATE_KEY, `${new Date().getTime()}`);
    }

    public hasNewUpdates$(): Observable<boolean> {
        const lastConsultedDate = this.getLastConsultedDate();

        if (!lastConsultedDate) {
            return of(true);
        }

        return this.getLastUpdateDate$().pipe(map(lastUpdate => lastUpdate > lastConsultedDate));
    }
}
