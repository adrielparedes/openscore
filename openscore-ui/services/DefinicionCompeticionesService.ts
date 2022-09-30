import { DefinicionCompeticion } from "./../model/DefinicionCompeticion";
import Service from "./Service";

export class DefinicionCompeticionesService extends Service<
  DefinicionCompeticion,
  DefinicionCompeticion,
  DefinicionCompeticion
> {
  constructor() {
    super("competciones");
  }
}
