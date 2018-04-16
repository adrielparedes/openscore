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
}
