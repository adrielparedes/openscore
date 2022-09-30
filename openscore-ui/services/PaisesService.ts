import { CrearPais } from "../model/CrearPais";
import { Pais } from "../model/Pais";
import Service from "./Service";

export class PaisesService extends Service<Pais, CrearPais, CrearPais> {
  constructor() {
    super("paises");
  }
}
