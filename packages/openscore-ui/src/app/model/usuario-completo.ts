import { Pais } from './pais';
export interface UsuarioCompleto {
    id: number;
    nombre: string;
    apellido: string;
    pais: Pais;
    email: string;
    deleted: boolean;
    creationDate: Date;
    deletionDate: Date;
    modificationDate: Date;
}
