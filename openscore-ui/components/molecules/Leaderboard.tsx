import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Ranking } from "../../model/Ranking";
import { RankingService } from "../../services/RankingService";
import TeamFlag from "../atoms/TeamFlag";
import EmptyScreen from "./EmptyScreen";
import LoadingScreen from "./LoadingScreen";

interface LeaderboardProps {
  filter: string;
  query: string;
  results?: number;
}

const Leaderboard = ({ filter, query, results }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<Ranking[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<Ranking[]>([]);
  const [busy, setBusy] = useState(false);
  const service = new RankingService();
  const router = useRouter();

  useEffect(() => {
    if (!filter) {
      return;
    }

    if (filter === "none") {
      return;
    }

    setBusy(true);

    var f = filter;

    if (f === "general") {
      f = "";
    }

    service
      .getAll(f, results || 1000)
      .then((res) => {
        setLeaderboard(res.data.data);
        setFilteredLeaderboard(res.data.data);
        setBusy(false);
      })
      .catch((err) => {
        setLeaderboard([]);
        setFilteredLeaderboard([]);
        setBusy(false);
      });
  }, [router, filter]);

  useEffect(() => {
    if (query !== undefined && query.length > 0) {
      setFilteredLeaderboard(
        leaderboard.filter(
          (l) =>
            l.nombre.toLowerCase().includes(query.toLowerCase()) ||
            l.pais.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      setFilteredLeaderboard(leaderboard);
    }
  }, [query]);

  return (
    <LoadingScreen busy={busy}>
      <EmptyScreen isEmpty={filteredLeaderboard.length < 1}>
        <div className="mt-4">
          <div className="leaderboard">
            {filteredLeaderboard.map((l) => (
              <div
                key={l.nombre}
                className={`card border-light leaderboard__line leaderboard--${l.ranking}`}
              >
                <div className="card-body ">
                  <div className="leaderboard__user">
                    <div className="leaderboard__nombre">{l.nombre}</div>
                    <div className="leaderboard__puntos">
                      Score: {l.puntos} points
                    </div>
                  </div>
                  <div className="leaderboard__country">
                    <span>{l.pais}</span> <TeamFlag src={l.pais}></TeamFlag>
                  </div>
                  <div className={`leaderboard__position`}>
                    <span>{l.ranking}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </EmptyScreen>
    </LoadingScreen>
  );
};

export default Leaderboard;
