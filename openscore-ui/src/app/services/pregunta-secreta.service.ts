import { PreguntaSecreta } from './../model/pregunta-secreta';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Rest } from './rest';

@Injectable()
export class PreguntaSecretaService extends Rest<PreguntaSecreta, PreguntaSecreta, PreguntaSecreta>{

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/preguntas';
    }

}
