import { Equipo } from "./Equipo";
import { Grupo } from "./Grupo";

export default interface Standing {
  equipo: Equipo;
  grupo: Grupo;
  puntos: number;
  empatados: number;
  ganados: number;
  perdidos: number;
  diferenciaGol: number;
}
