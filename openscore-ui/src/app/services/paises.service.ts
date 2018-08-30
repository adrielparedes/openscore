import { HttpClient } from '@angular/common/http';
import { Pais } from './../model/pais';
import { Injectable } from '@angular/core';
import { Rest } from './rest';
import { CrearPais } from '../model/crear-pais';

@Injectable()
export class PaisesService extends Rest<Pais, CrearPais, CrearPais>{

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/paises';
    }
}
