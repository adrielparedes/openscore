import { Fase } from "../model/Fase";
import { CrearFase } from "./../model/CrearFase";
import Service from "./Service";

export class FaseService extends Service<Fase, CrearFase, CrearFase> {
  constructor() {
    super("fases");
  }
}
