import { RestConfiguration } from './rest-configuration';
import { ApiResponse } from './../model/api-response';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';

export abstract class Rest<X, Y, Z> extends RestConfiguration {

    protected http: HttpClient;

    constructor(http: HttpClient) {
        super();
        this.http = http;
    }

    public getAll(page: number, pageSize: number, parameters?: Array<any>) {


        let params = new HttpParams();
        if (parameters !== undefined) {
            parameters.forEach(elem => {
                params = params.set(elem.key, elem.value)
            });
        }


        console.log(params.keys());
        return this.http
            .get<ApiResponse<X[]>>(this.getUrl(this.getServiceUrl()), { params: params });
    }

    public get(id: number) {
        return this.http
            .get<ApiResponse<X>>(this.getUrl(this.getServiceUrl() + '/' + id));
    }

    public delete(id: number) {
        return this.http
            .delete<ApiResponse<number>>(this.getUrl(this.getServiceUrl() + '/' + id));
    }

    public add(storable: Y) {
        return this.http
            .post<ApiResponse<X>>(this.getUrl(this.getServiceUrl()), storable);
    }


    public update(id: number, storable: Z) {
        return this.http
            .post<ApiResponse<X>>(this.getUrl(this.getServiceUrl() + '/' + id), storable);
    }

}
