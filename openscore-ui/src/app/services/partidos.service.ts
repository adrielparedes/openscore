import { ApiResponse } from './../model/api-response';
import { CrearPartido } from './../model/crear-partido';
import { Partido } from './../model/partido';
import { Rest } from './rest';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PartidosService extends Rest<Partido, CrearPartido, CrearPartido> {

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/partidos';
    }

    getFechas() {
        return this.http.get<ApiResponse<number[]>>(this.getUrl(this.getServiceUrl()) + '/fechas');
    }


}
