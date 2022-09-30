import { CrearEquipo } from "../model/CrearEquipo";
import { Equipo } from "./../model/Equipo";
import Service from "./Service";

export class EquiposService extends Service<Equipo, CrearEquipo, CrearEquipo> {
  constructor() {
    super("equipos");
  }
}
