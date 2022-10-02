import { ApiResponse } from "../model/ApiResponse";
import { CrearNoticia } from "../model/CrearNoticia";
import { Noticia } from "../model/Noticia";
import rest from "./Rest";
import Service from "./Service";

export class NoticiasService extends Service<
  Noticia,
  CrearNoticia,
  CrearNoticia
> {
  constructor() {
    super("posts");
  }

  publicar(id: number) {
    return rest.post<ApiResponse<Noticia>>(
      `${this.serviceUrl}/${id}/publicar`,
      {}
    );
  }

  retirar(id: number) {
    return rest.post<ApiResponse<Noticia>>(
      `${this.serviceUrl}/${id}/retirar`,
      {}
    );
  }
}
