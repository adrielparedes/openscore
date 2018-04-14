import { Fase } from './fase';
import { Grupo } from './grupo';
import { Equipo } from './equipo';
export interface Partido {

    id: number;
    local: Equipo;
    visitante: Equipo;
    fecha: Date;
    lugar: string;
    resultado: string;
    grupo: Grupo;
    fase: Fase;
    status: string;
}
