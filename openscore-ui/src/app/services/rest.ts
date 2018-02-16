import { ApiResponse } from './../model/api-response';
import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

export abstract class Rest<T> {

    protected http: HttpClient;

    private baseUrl = 'http://localhost:8080/openscore/api/rest';

    constructor(http: HttpClient) {
        this.http = http;
    }

    getUrl(url: string) {
        return this.baseUrl + url;
    }

    abstract getServiceUrl(): string;


    public getAll(page: number, pageSize: number) {
        return this.http
            .get<ApiResponse<T[]>>(this.getUrl(this.getServiceUrl()));
    }

    public get(id: number) {
        return this.http
            .get<ApiResponse<T>>(this.getUrl(this.getServiceUrl() + '/' + id));
    }

    public delete(id: number) {
        return this.http
            .delete<ApiResponse<number>>(this.getUrl(this.getServiceUrl() + '/' + id));
    }

    public add(storable: T) {
        return this.http
            .post<ApiResponse<T>>(this.getUrl(this.getServiceUrl()), storable);
    }


    public update(id: number, storable: T) {
        return this.http
            .post<ApiResponse<T>>(this.getUrl(this.getServiceUrl() + '/' + id), storable);
    }

}
