import { HttpClient } from '@angular/common/http';
import { CrearNoticia } from './../model/crear-noticia';
import { Injectable } from '@angular/core';
import { Rest } from './rest';
import { Noticia } from '../model/noticia';

@Injectable()
export class NoticiasService extends Rest<Noticia, CrearNoticia, CrearNoticia>{

    constructor(http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/posts';
    }

}
