import { UsuarioCompleto } from "..//model/UsuarioCompleto";
import { Token } from "../model/Token";
import { Usuario } from "../model/Usuario";
import { ApiResponse } from "./../model/ApiResponse";
import { CrearUsuario } from "./../model/CrearUsuario";
import { LoginUsuario } from "./../model/LoginUsuario";
import { UpdateUsuario } from "./../model/UpdateUsuario";
import rest from "./Rest";
import Service from "./Service";

export class UsuarioService extends Service<
  Usuario,
  CrearUsuario,
  UpdateUsuario
> {
  private getAllAdminUrl = "/admin";
  private registrarUrl = "registrar";
  private loginUrl = "login";
  private updatePasswordUrl = "password";
  private recoverPasswordUrl = "recover";
  private sendRecoverEmailUrl = "token";

  constructor() {
    super("usuarios");
  }

  public allAdmin(page: number, pageSize: number) {
    return rest.get<ApiResponse<UsuarioCompleto[]>>(this.getAllAdminUrl);
  }

  public updateUser(id: number, storable: UpdateUsuario) {
    return rest.post<ApiResponse<Token>>(
      `${this.serviceUrl}/update/${id}`,
      storable
    );
  }

  public getMyUser() {
    return rest.get<ApiResponse<Usuario>>(`${this.serviceUrl}/myself`);
  }

  public registrar(usuario: CrearUsuario) {
    return rest.post(`${this.serviceUrl}/${this.registrarUrl}`, usuario);
  }

  public login(usuario: LoginUsuario) {
    return rest.post<ApiResponse<Token>>(
      `${this.serviceUrl}/${this.loginUrl}`,
      usuario
    );
  }

  public recoverPassword(recoverPassword: any) {
    return rest.post<ApiResponse<Token>>(
      `${this.serviceUrl}/${this.recoverPasswordUrl}`,
      recoverPassword
    );
  }

  public updatePassword(updatePassword: any) {
    return rest.post<ApiResponse<Token>>(
      `${this.serviceUrl}/${this.updatePasswordUrl}`,
      updatePassword
    );
  }

  public sendRecoverEmail(email: string) {
    return rest.get<ApiResponse<string>>(
      `${this.serviceUrl}/${this.sendRecoverEmailUrl}/email`,
      {}
    );
  }
}
