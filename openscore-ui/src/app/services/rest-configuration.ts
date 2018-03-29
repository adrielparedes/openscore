import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class RestConfiguration {


    private baseUrl = 'http://localhost:8080/openscore/api/rest';

    getUrl(url: string) {
        return this.baseUrl + url;
    }

    abstract getServiceUrl(): string;

}