import { HttpClient } from '@angular/common/http';
import { CrearNoticia } from './../model/crear-noticia';
import { Injectable } from '@angular/core';
import { Rest } from './rest';
import { Noticia } from '../model/noticia';
import { ApiResponse } from '../model/api-response';

@Injectable()
export class NoticiasService extends Rest<Noticia, CrearNoticia, CrearNoticia>{

    constructor(http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/posts';
    }

    publicar(id: number) {
        return this.http.post<ApiResponse<Noticia>>(this.getUrl(this.getServiceUrl()) + `/${id}/publicar`, {});
    }


    retirar(id: number) {
        return this.http.post<ApiResponse<Noticia>>(this.getUrl(this.getServiceUrl()) + `/${id}/retirar`, {});
    }

}
