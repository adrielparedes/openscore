import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable()
export abstract class RestConfiguration {


    private baseUrl = environment.url;

    getUrl(url: string) {
        return this.baseUrl + url;
    }

    abstract getServiceUrl(): string;

}