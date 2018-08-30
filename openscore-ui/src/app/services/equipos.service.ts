import { CrearEquipo } from './../model/crear-equipo';
import { ApiResponse } from './../model/api-response';
import { Equipo } from './../model/equipo';
import { Rest } from './rest';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class EquiposService extends Rest<Equipo, CrearEquipo, CrearEquipo> {


    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/equipos';
    }

}
