import { UpdateUsuario } from './../model/update-usuario';
import { Token } from './../model/token';
import { ApiResponse } from './../model/api-response';
import { Injector } from '@angular/core/src/di/injector';
import { Rest } from './rest';
import { CrearUsuario } from './../model/crear-usuario';
import { LoginUsuario } from './../model/login-usuario';
import { Usuario } from './../model/usuario';
import { UsuariosRoutingModule } from './../views/admin/usuarios/usuarios.routing';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioCompleto } from 'app/model/usuario-completo';

@Injectable()
export class UsuarioService extends Rest<Usuario, CrearUsuario, UpdateUsuario> {

    private getAllUrl = '/usuarios';
    private getAllAdminUrl = '/admin';
    private registrarUrl = '/usuarios/registrar';
    private loginUrl = '/usuarios/login';
    private updatePasswordUrl = '/usuarios/password';
    private recoverPasswordUrl = '/usuarios/recover';
    private sendRecoverEmailUrl = '/usuarios/token'

    constructor(protected http: HttpClient) {
        super(http);
    }

    getServiceUrl() {
        return '/usuarios'
    }

    public allAdmin(page: number, pageSize: number) {
        return this.http
            .get<ApiResponse<UsuarioCompleto[]>>(this.getUrl(this.getAllAdminUrl));


    }

    public updateUser(id: number, storable: UpdateUsuario) {
        return this.http
            .post<ApiResponse<Token>>(this.getUrl(this.getServiceUrl() + '/update/' + id), storable);
    }

    public getMyUser() {
        return this.http
            .get<ApiResponse<Usuario>>(this.getUrl(this.getServiceUrl()) + '/myself');
    }

    public registrar(usuario: CrearUsuario) {
        return this.http
            .post(this.getUrl(this.registrarUrl), usuario);
    }

    public login(usuario: LoginUsuario) {
        return this.http.post<ApiResponse<Token>>(this.getUrl(this.loginUrl), usuario);
    }

    public recoverPassword(recoverPassword: any) {
        return this.http.post<ApiResponse<Token>>(this.getUrl(this.recoverPasswordUrl), recoverPassword);
    }

    public updatePassword(updatePassword: any) {
        return this.http.post<ApiResponse<Token>>(this.getUrl(this.updatePasswordUrl), updatePassword);
    }

    public sendRecoverEmail(email: string) {
        return this.http.get<ApiResponse<string>>(this.getUrl(this.sendRecoverEmailUrl) + '/' + email, {});
    }

}
