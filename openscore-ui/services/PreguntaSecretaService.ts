import { PreguntaSecreta } from "../model/PreguntaSecreta";
import Service from "./Service";

export class PreguntaSecretaService extends Service<
  PreguntaSecreta,
  PreguntaSecreta,
  PreguntaSecreta
> {
  constructor() {
    super("preguntas");
  }
}
