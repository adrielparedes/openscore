import { DefinicionCompeticion } from './../model/definicion-competicion';
import { ApiResponse } from './../model/api-response';
import { HttpClient } from '@angular/common/http';
import { Rest } from './rest';
import { Injectable } from '@angular/core';

@Injectable()
export class DefinicionCompeticionesService extends Rest<DefinicionCompeticion> {

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/competiciones'
    }

}
