import { Resultado } from './resultado';
import { Pronostico } from './pronostico';
import { Fase } from './fase';
import { Grupo } from './grupo';
import { Equipo } from './equipo';
export interface Partido {

    id: number;
    local: Equipo;
    visitante: Equipo;
    dia: Date;
    fecha: number;
    lugar: string;
    resultado: Resultado;
    grupo: Grupo;
    fase: Fase;
    status: string;
    pronostico: Pronostico;
}
