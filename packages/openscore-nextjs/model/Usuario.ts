import { Pais } from "./Pais";
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  pais: Pais;
}
