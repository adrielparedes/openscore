import type { Partido, Equipo, Fase, Grupo, Pais, Pronostico, Standing, Post, Usuario, Rol } from "@prisma/client";

export type PartidoStatus = "PENDING" | "BLOCKED" | "FINISHED";
export type Ganador = "LOCAL" | "VISITANTE" | "EMPATE";

export interface PartidoConRelaciones extends Partido {
  local: Equipo;
  visitante: Equipo;
  fase: Fase;
  grupo: Grupo | null;
  status: PartidoStatus;
  ganador: Ganador | null;
}

export interface PronosticoConPartido extends Pronostico {
  partido: PartidoConRelaciones;
}

export interface PartidoPronostico extends PartidoConRelaciones {
  pronostico: Pronostico | null;
  puntos: number;
}

export interface RankingEntry {
  usuario: number;
  nombre: string;
  pais: string;
  puntos: number;
  ranking: number;
  stickerCard?: string | null;
  aciertos: number;
  totalPronosticos: number;
  totalPredicted: number;
  totalPartidos: number;
  totalMatches: number;
  accuracy: number;
  coverage: number;
}

export interface StandingConRelaciones extends Standing {
  equipo: Equipo;
  grupo: Grupo | null;
}

export interface UsuarioConRelaciones extends Usuario {
  pais: Pais;
  roles: { rol: Rol }[];
}

export type { Pais, Equipo, Fase, Grupo, Post, PreguntaSecreta } from "@prisma/client";
