import { Injectable } from '@angular/core';
import { from, type Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { RecordModel } from 'pocketbase';
import { FormatterUtils } from '../utils/formatter.utils';
import type { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class ServerService {
    public getServer$(code: string): Observable<RecordModel> {
        return from(environment.pb.collection('servers').getOne(code));
    }

    public createServer$(name: string, user: User): Observable<RecordModel> {
        return from(
            environment.pb
                .collection('servers')
                .create({ name: FormatterUtils.valueFormatter(name, 'name'), owner: user.id })
        );
    }
}
