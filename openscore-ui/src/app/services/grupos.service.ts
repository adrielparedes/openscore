import { HttpClient } from '@angular/common/http';
import { CrearPartido } from './../model/crear-partido';
import { Grupo } from './../model/grupo';
import { Injectable } from '@angular/core';
import { Rest } from './rest';

@Injectable()
export class GruposService extends Rest<Grupo, CrearPartido, CrearPartido> {

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/grupos';
    }

}
