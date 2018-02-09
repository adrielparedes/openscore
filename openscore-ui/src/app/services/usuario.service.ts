import { Injector } from '@angular/core/src/di/injector';
import { Rest } from './rest';
import { CrearUsuario } from './../model/crear-usuario';
import { Usuario } from './../model/usuario';
import { UsuariosRoutingModule } from './../views/admin/usuarios/usuarios.routing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UsuarioService extends Rest {

    private registrarUrl = '/usuarios/registrar';


    constructor(protected http: HttpClient) {
        super(http);
    }

    public registrar(usuario: CrearUsuario) {
        console.log(this.getUrl(this.registrarUrl));
        console.log(usuario);
        return this.http
            .post(this.getUrl(this.registrarUrl), usuario);
    }

}
