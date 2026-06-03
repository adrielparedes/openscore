import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isBloqueado(dia: Date): boolean {
  return dia.getTime() <= Date.now() + 15 * 60 * 1000;
}

export type Ganador = "LOCAL" | "VISITANTE" | "EMPATE";

export function calcularGanador(
  local: number,
  visitante: number,
  penales: boolean,
  penalesLocal: number | null,
  penalesVisitante: number | null
): Ganador {
  if (penales && penalesLocal != null && penalesVisitante != null) {
    if (penalesLocal > penalesVisitante) return "LOCAL";
    if (penalesLocal < penalesVisitante) return "VISITANTE";
    return "EMPATE";
  }
  if (local > visitante) return "LOCAL";
  if (local < visitante) return "VISITANTE";
  return "EMPATE";
}

export type PartidoStatus = "PENDING" | "BLOCKED" | "FINISHED";

export function calcularStatus(
  dia: Date,
  resultadoLocal: number | null
): PartidoStatus {
  if (resultadoLocal !== null) return "FINISHED";
  if (isBloqueado(dia)) return "BLOCKED";
  return "PENDING";
}
