import { ApiResponse } from './../model/api-response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestConfiguration } from './rest-configuration';

@Injectable()
export class InfoService extends RestConfiguration {

    constructor(private http: HttpClient) {
        super()
    }

    getServiceUrl() {
        return '/info';
    }

    public securePing() {
        return this.http
            .get<ApiResponse<string>>(this.getUrl(this.getServiceUrl()) + '/ping/secure');
    }


}
