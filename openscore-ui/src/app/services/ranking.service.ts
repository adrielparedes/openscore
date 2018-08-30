import { Ranking } from './../model/ranking';
import { ApiResponse } from './../model/api-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestConfiguration } from './rest-configuration';

@Injectable()
export class RankingService extends RestConfiguration {

    constructor(private http: HttpClient) {
        super()
    }

    getServiceUrl() {
        return '/ranking';
    }

    public getAll(pais: string, size: number) {
        const params = new HttpParams()
            .set('pais', pais)
            .set('size', size.toString());
        return this.http
            .get<ApiResponse<Ranking[]>>(this.getUrl(this.getServiceUrl()), { params: params });
    }



}