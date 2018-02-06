import { HttpClient } from '@angular/common/http';
import { Injector } from '@angular/core';

export class Rest {

    protected http: HttpClient;

    private baseUrl = 'http://localhost:8080/openscore/api/rest';

    constructor(http: HttpClient) {
        this.http = http;
    }

    getUrl(url: string) {
        return this.baseUrl + url;
    }

}
