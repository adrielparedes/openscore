import { Equipo } from './equipo';
export interface Partido {

    id: number;
    local: Equipo;
    visitante: Equipo;
    fecha: Date;
    lugar: string;
    resultado: string;
    estado: string;
}
