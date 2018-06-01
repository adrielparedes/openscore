import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class AddHeaderInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.authService.getLocalStorageToken();

        if (token !== undefined) {
            const clonedRequest = req.clone({
                setHeaders: {
                    'Authorization': 'Bearer ' + token
                }
            });
            return next.handle(clonedRequest);
        } else {
            return next.handle(req);
        }
    }

}
