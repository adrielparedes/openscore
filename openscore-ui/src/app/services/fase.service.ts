import { HttpClient } from '@angular/common/http';
import { CrearFase } from './../model/crear-fase';
import { Fase } from './../model/fase';
import { Injectable } from '@angular/core';
import { Rest } from './rest';

@Injectable()
export class FaseService extends Rest<Fase, CrearFase, CrearFase>{

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/fases';
    }

}
