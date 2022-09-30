import { ApiResponse } from "../model/ApiResponse";
import { CrearPartido } from "../model/CrearPartido";
import { Partido } from "../model/Partido";
import rest from "./Rest";
import Service from "./Service";

export class PronosticoService extends Service<
  Partido,
  CrearPartido,
  CrearPartido
> {
  constructor() {
    super("pronosticos");
  }

  local(id: number) {
    return rest.post<ApiResponse<Partido>>(
      `${this.serviceUrl}/${id}/local`,
      {}
    );
  }

  empate(id: number) {
    return rest.post<ApiResponse<Partido>>(
      `${this.serviceUrl}/${id}/empate`,
      {}
    );
  }

  visitante(id: number) {
    return rest.post<ApiResponse<Partido>>(
      `${this.serviceUrl}/${id}/visitante`,
      {}
    );
  }
}
