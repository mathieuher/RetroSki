import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, type WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate } from '@angular/service-worker';
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
    private sw = inject(SwUpdate);

    public checkingUpdates: WritableSignal<boolean>;

    constructor() {
        if (this.sw.isEnabled) {
            this.checkingUpdates = signal(true);
            this.sw.versionUpdates.pipe(takeUntilDestroyed()).subscribe(() => {
                this.checkingUpdates.set(false);
            });
        } else {
            this.checkingUpdates = signal(false);
        }
    }

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
