import { CrearPartido } from "./../model/CrearPartido";
import { Grupo } from "./../model/Grupo";
import Service from "./Service";

export class GruposService extends Service<Grupo, CrearPartido, CrearPartido> {
  constructor() {
    super("grupos");
  }
}
