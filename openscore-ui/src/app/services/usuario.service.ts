import { ApiResponse } from './../model/api-response';
import { Injector } from '@angular/core/src/di/injector';
import { Rest } from './rest';
import { CrearUsuario } from './../model/crear-usuario';
import { Usuario } from './../model/usuario';
import { UsuariosRoutingModule } from './../views/admin/usuarios/usuarios.routing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioCompleto } from 'app/model/usuario-completo';

@Injectable()
export class UsuarioService extends Rest {

    private getAllUrl = '/usuarios';
    private getAllAdminUrl = '/admin';
    private registrarUrl = '/usuarios/registrar';


    constructor(protected http: HttpClient) {
        super(http);
    }

    public all(page: number, pageSize: number) {
        return this.http
            .get<ApiResponse<Usuario[]>>(this.getUrl(this.getAllUrl));

    }

    public allAdmin(page: number, pageSize: number) {
        return this.http
            .get<ApiResponse<UsuarioCompleto[]>>(this.getUrl(this.getAllAdminUrl));


    }

    public registrar(usuario: CrearUsuario) {
        console.log(this.getUrl(this.registrarUrl));
        console.log(usuario);
        return this.http
            .post(this.getUrl(this.registrarUrl), usuario);
    }

}
