import { Ranking } from './../model/ranking';
import { ApiResponse } from './../model/api-response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rest } from './rest';
import { RestConfiguration } from './rest-configuration';

@Injectable()
export class RankingService extends RestConfiguration {

    constructor(private http: HttpClient) {
        super()
    }

    getServiceUrl() {
        return '/ranking';
    }

    public getAll(page: number, pageSize: number) {
        return this.http
            .get<ApiResponse<Ranking[]>>(this.getUrl(this.getServiceUrl()));
    }



}