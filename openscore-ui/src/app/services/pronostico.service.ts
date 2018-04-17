import { Pronostico } from './../model/pronostico';
import { ApiResponse } from './../model/api-response';
import { HttpClient } from '@angular/common/http';
import { CrearPartido } from './../model/crear-partido';
import { Partido } from './../model/partido';
import { Injectable } from '@angular/core';
import { Rest } from './rest';

@Injectable()
export class PronosticoService extends Rest<Partido, CrearPartido, CrearPartido>  {

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/pronosticos';
    }

    local(id: number) {
        return this.http.post<ApiResponse<Pronostico>>(this.getUrl(this.getServiceUrl()) + '/' + id + '/local', {});
    }

    empate(id: number) {
        return this.http.post<ApiResponse<Pronostico>>(this.getUrl(this.getServiceUrl()) + '/' + id + '/empate', {});
    }

    visitante(id: number) {
        return this.http.post<ApiResponse<Pronostico>>(this.getUrl(this.getServiceUrl()) + '/' + id + '/visitante', {});
    }


}
