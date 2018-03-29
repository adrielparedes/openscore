import { Injectable } from '@angular/core';
import { StorageService } from '../services/storage.service';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

    constructor(private storageService: StorageService) {
        console.log('Interceptor');
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.storageService.getToken();

        if (token) {
            console.log(token);
            const clonedRequest = req.clone({
                setHeaders: {
                    'Authorization': 'Bearer 123',
                    'content-type': 'application/json'
                }
            });
            return next.handle(clonedRequest);
        }

        console.log('No token');
        return next.handle(req);
    }

}
