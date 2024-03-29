import { Equipo } from "./Equipo";
import { Fase } from "./Fase";
import { Grupo } from "./Grupo";
import MatchStatus from "./MatchStatus";
import { Pronostico } from "./Pronostico";
import { Resultado } from "./Resultado";

export interface Partido {
  id: number;
  local: Equipo;
  visitante: Equipo;
  dia: number;
  fecha: number;
  lugar: string;
  resultado: Resultado;
  grupo: Grupo;
  fase: Fase;
  status: MatchStatus;
  pronostico: Pronostico;
}
