import { ApiResponse } from "../model/ApiResponse";
import { CrearPartido } from "../model/CrearPartido";
import { Partido } from "../model/Partido";
import { Resultado } from "../model/Resultado";
import rest from "./Rest";
import Service from "./Service";

export class PartidosService extends Service<
  Partido,
  CrearPartido,
  CrearPartido
> {
  constructor() {
    super("partidos");
  }

  getFechas() {
    return rest.get<ApiResponse<number[]>>(`${this.serviceUrl}/fechas`);
  }

  resultado(partidoId: number, resultado: Resultado) {
    return rest.post<ApiResponse<Partido>>(
      `${this.serviceUrl}/${partidoId}/resultado`,
      resultado
    );
  }
}
