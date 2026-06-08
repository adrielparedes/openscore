import Image from "next/image";
import { Trophy, Medal, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Props {
  nombre: string;
  pais: string;
  puntos: number;
  ranking: number;
  stickerCard?: string | null;
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-amber-400 border-2 border-card flex items-center justify-center shadow-md z-10">
        <Trophy className="h-4 w-4 text-white" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-slate-400 border-2 border-card flex items-center justify-center shadow-md z-10">
        <Medal className="h-4 w-4 text-white" />
      </div>
    );
  return (
    <div className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-amber-700 border-2 border-card flex items-center justify-center shadow-md z-10">
      <Medal className="h-4 w-4 text-white" />
    </div>
  );
}

const rankBorderColor: Record<number, string> = {
  1: "border-amber-400 shadow-amber-700/50",
  2: "border-slate-400 shadow-slate-700/50",
  3: "border-amber-700 shadow-amber-900/30",
};

const rankLabelColor: Record<number, string> = {
  1: "text-amber-400",
  2: "text-muted-foreground",
  3: "text-amber-400",
};

export default function StickerCardDisplay({ nombre, pais, puntos, ranking, stickerCard }: Props) {
  const borderColor = rankBorderColor[ranking] ?? "border-border shadow-border/50";
  const labelColor = rankLabelColor[ranking] ?? "text-muted-foreground";

  return (
    <div className="flex flex-col items-center gap-3">
      {/* outer: relative sin overflow-hidden para que el RankIcon pueda salir */}
      <div className={`relative w-full aspect-[3/4] rounded-xl border-2 ${borderColor} shadow-lg bg-secondary`}>
        {/* inner: clip separado para imagen y gradiente */}
        <div className="absolute inset-0 rounded-[10px] overflow-hidden">
          {stickerCard ? (
            <Image
              src={stickerCard}
              alt={`${nombre}'s sticker card`}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-border">
              <div className="h-16 w-16 rounded-full bg-border flex items-center justify-center">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground font-medium px-2 text-center">{nombre}</span>
            </div>
          )}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3 pt-6">
            <p className="text-white font-bold text-sm leading-tight truncate">{nombre}</p>
            <p className="text-white/70 text-xs uppercase tracking-wide">{pais}</p>
          </div>
        </div>
        {/* icon fuera del clip, puede sobresalir */}
        <RankIcon rank={ranking} />
      </div>

      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold uppercase tracking-wide ${labelColor}`}>
          #{ranking}
        </span>
        <Badge variant="warning" className="text-xs font-bold">
          {puntos} pts
        </Badge>
      </div>
    </div>
  );
}
