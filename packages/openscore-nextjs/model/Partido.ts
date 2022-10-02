import { Equipo } from "./Equipo";
import { Fase } from "./Fase";
import { Grupo } from "./Grupo";
import { Pronostico } from "./Pronostico";
import { Resultado } from "./Resultado";

export interface Partido {
  id: number;
  local: Equipo;
  visitante: Equipo;
  dia: Date;
  fecha: number;
  lugar: string;
  resultado: Resultado;
  grupo: Grupo;
  fase: Fase;
  status: string;
  pronostico: Pronostico;
}
