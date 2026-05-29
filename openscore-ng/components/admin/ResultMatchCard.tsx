"use client";

import { setResultado, setEquipos } from "@/actions/partidos";
import type { PartidoConRelaciones, Equipo } from "@/types";
import { flagUrl } from "@/lib/flags";
import { Badge } from "@/components/ui/Badge";
import { CalendarClock, Check, Loader2, Pencil } from "lucide-react";
import { useTransition, useState } from "react";
import { cn } from "@/lib/utils";

interface ResultMatchCardProps {
  match: PartidoConRelaciones;
  equipos: Equipo[];
}

export default function ResultMatchCard({ match, equipos }: ResultMatchCardProps) {
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [localScore, setLocalScore] = useState<string>(
    match.resultadoLocal != null ? String(match.resultadoLocal) : ""
  );
  const [visitanteScore, setVisitanteScore] = useState<string>(
    match.resultadoVisitante != null ? String(match.resultadoVisitante) : ""
  );
  const [penales, setPenales] = useState(match.resultadoPenales ?? false);
  const [penalesLocal, setPenalesLocal] = useState<string>(
    match.resultadoPenalesLocal != null ? String(match.resultadoPenalesLocal) : ""
  );
  const [penalesVisitante, setPenalesVisitante] = useState<string>(
    match.resultadoPenalesVisitante != null ? String(match.resultadoPenalesVisitante) : ""
  );

  const [localId, setLocalId] = useState<number>(match.localId);
  const [visitanteId, setVisitanteId] = useState<number>(match.visitanteId);
  const [editingTeams, setEditingTeams] = useState(false);
  const [teamsDirty, setTeamsDirty] = useState(false);
  const [teamSaved, setTeamSaved] = useState(false);

  const selectedLocal = equipos.find((e) => e.id === localId) ?? match.local;
  const selectedVisitante = equipos.find((e) => e.id === visitanteId) ?? match.visitante;

  const matchDate = new Date(match.dia).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleSubmit = () => {
    const local = parseInt(localScore);
    const visitante = parseInt(visitanteScore);

    if (isNaN(local) || isNaN(visitante) || local < 0 || visitante < 0) {
      setError("Enter valid scores (0 or higher).");
      return;
    }
    if (penales) {
      const pLocal = parseInt(penalesLocal);
      const pVisitante = parseInt(penalesVisitante);
      if (isNaN(pLocal) || isNaN(pVisitante) || pLocal < 0 || pVisitante < 0) {
        setError("Enter valid penalty scores.");
        return;
      }
    }

    setError(null);
    setSaved(false);

    startTransition(async () => {
      try {
        await setResultado(match.id, {
          local: parseInt(localScore),
          visitante: parseInt(visitanteScore),
          penales,
          penalesLocal: penales ? parseInt(penalesLocal) : undefined,
          penalesVisitante: penales ? parseInt(penalesVisitante) : undefined,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch {
        setError("Failed to save. Please try again.");
      }
    });
  };

  const handleSaveTeams = () => {
    startTransition(async () => {
      try {
        await setEquipos(match.id, { localId, visitanteId });
        setTeamsDirty(false);
        setEditingTeams(false);
        setTeamSaved(true);
        setTimeout(() => setTeamSaved(false), 3000);
      } catch {
        setError("Failed to save teams. Please try again.");
      }
    });
  };

  const scoreInput =
    "w-14 h-10 text-center text-lg font-bold rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent disabled:opacity-50";

  const teamSelect =
    "w-full rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium px-2 py-1 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent cursor-pointer";

  return (
    <div
      className={cn(
        "rounded-2xl border bg-white shadow-sm overflow-hidden transition-all",
        match.status === "FINISHED" ? "border-emerald-200" : "border-slate-200",
        pending && "opacity-60 pointer-events-none"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <CalendarClock className="h-3.5 w-3.5" />
          <span>{matchDate}</span>
        </div>
        <div className="flex items-center gap-2">
          {match.grupo && <Badge variant="muted">{match.grupo.nombre}</Badge>}
          <Badge variant="muted">{match.fase.nombre}</Badge>
          {{
            PENDING: <Badge variant="success">Open</Badge>,
            BLOCKED: <Badge variant="warning">Locked</Badge>,
            FINISHED: <Badge variant="muted">Finished</Badge>,
          }[match.status]}
          <button
            onClick={() => {
              setEditingTeams((v) => !v);
              if (editingTeams) {
                setLocalId(match.localId);
                setVisitanteId(match.visitanteId);
                setTeamsDirty(false);
              }
            }}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
              editingTeams
                ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            )}
          >
            <Pencil className="h-3 w-3" />
            {editingTeams ? "Cancel" : "Edit teams"}
          </button>
        </div>
      </div>

      {/* Teams + score inputs */}
      <div className="flex items-center gap-4 px-6 py-5">
        {/* Local team */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          {flagUrl(selectedLocal.codigo) && (
            <img
              src={flagUrl(selectedLocal.codigo, 80)}
              alt={selectedLocal.codigo}
              width={48}
              height={34}
              className="rounded object-cover shadow-sm"
            />
          )}
          {editingTeams ? (
            <div className="w-full flex items-center gap-1">
              <Pencil className="h-3 w-3 text-slate-300 shrink-0" />
              <select
                value={localId}
                onChange={(e) => {
                  setLocalId(Number(e.target.value));
                  setTeamsDirty(true);
                  setTeamSaved(false);
                }}
                className={teamSelect}
              >
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nombre} ({eq.codigo})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <span className="font-bold text-slate-900 text-center text-sm leading-tight">
                {selectedLocal.nombre}
              </span>
              <span className="text-xs text-slate-400 uppercase">{selectedLocal.codigo}</span>
            </>
          )}
        </div>

        {/* Score inputs */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={99}
              value={localScore}
              onChange={(e) => setLocalScore(e.target.value)}
              className={scoreInput}
              placeholder="–"
            />
            <span className="text-slate-400 font-bold text-lg">–</span>
            <input
              type="number"
              min={0}
              max={99}
              value={visitanteScore}
              onChange={(e) => setVisitanteScore(e.target.value)}
              className={scoreInput}
              placeholder="–"
            />
          </div>

          {/* Penalties toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
              className={cn(
                "relative w-9 h-5 rounded-full transition-colors",
                penales ? "bg-rose-500" : "bg-slate-200"
              )}
              onClick={() => {
                setPenales((v) => !v);
                if (penales) {
                  setPenalesLocal("");
                  setPenalesVisitante("");
                }
              }}
            >
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  penales && "translate-x-4"
                )}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">Penalties</span>
          </label>

          {/* Penalty score inputs */}
          {penales && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={99}
                value={penalesLocal}
                onChange={(e) => setPenalesLocal(e.target.value)}
                className={cn(scoreInput, "w-12 h-9 text-base")}
                placeholder="–"
              />
              <span className="text-slate-300 text-xs font-semibold">pen</span>
              <input
                type="number"
                min={0}
                max={99}
                value={penalesVisitante}
                onChange={(e) => setPenalesVisitante(e.target.value)}
                className={cn(scoreInput, "w-12 h-9 text-base")}
                placeholder="–"
              />
            </div>
          )}
        </div>

        {/* Visitante team */}
        <div className="flex-1 flex flex-col items-center gap-2 min-w-0">
          {flagUrl(selectedVisitante.codigo) && (
            <img
              src={flagUrl(selectedVisitante.codigo, 80)}
              alt={selectedVisitante.codigo}
              width={48}
              height={34}
              className="rounded object-cover shadow-sm"
            />
          )}
          {editingTeams ? (
            <div className="w-full flex items-center gap-1">
              <Pencil className="h-3 w-3 text-slate-300 shrink-0" />
              <select
                value={visitanteId}
                onChange={(e) => {
                  setVisitanteId(Number(e.target.value));
                  setTeamsDirty(true);
                  setTeamSaved(false);
                }}
                className={teamSelect}
              >
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.nombre} ({eq.codigo})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <span className="font-bold text-slate-900 text-center text-sm leading-tight">
                {selectedVisitante.nombre}
              </span>
              <span className="text-xs text-slate-400 uppercase">{selectedVisitante.codigo}</span>
            </>
          )}
        </div>
      </div>

      {/* Footer: feedback + save buttons */}
      <div className="px-5 pb-5 flex items-center justify-between gap-3">
        <div className="min-h-[20px]">
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          {saved && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Saved
            </p>
          )}
          {teamSaved && !saved && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Teams saved
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {teamsDirty && (
            <button
              onClick={handleSaveTeams}
              disabled={pending}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Save teams
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={pending}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 text-white shadow-sm shadow-pink-500/20 text-sm font-semibold px-4 py-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save result"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
