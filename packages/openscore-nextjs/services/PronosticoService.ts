import { ApiResponse } from "../model/ApiResponse";
import { CrearPartido } from "../model/CrearPartido";
import { Partido } from "../model/Partido";
import { Pronostico } from "../model/Pronostico";
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
    return rest.post<ApiResponse<Pronostico>>(
      `${this.serviceUrl}/${id}/local`,
      {}
    );
  }

  empate(id: number) {
    return rest.post<ApiResponse<Pronostico>>(
      `${this.serviceUrl}/${id}/empate`,
      {}
    );
  }

  visitante(id: number) {
    return rest.post<ApiResponse<Pronostico>>(
      `${this.serviceUrl}/${id}/visitante`,
      {}
    );
  }
}
