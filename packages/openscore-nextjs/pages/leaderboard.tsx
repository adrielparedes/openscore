import { useEffect, useState } from "react";
import EmptyScreen from "../components/molecules/EmptyScreen";
import LoadingScreen from "../components/molecules/LoadingScreen";
import { layout } from "../components/templates/MainLayout";
import { Ranking } from "../model/Ranking";
import { RankingService } from "../services/RankingService";
import { NextPageWithLayout } from "./_app";

const Leaderboard: NextPageWithLayout = () => {
  const [leaderboard, setLeaderboard] = useState<Ranking[]>([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<Ranking[]>([]);
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState(false);
  const service = new RankingService();

  useEffect(() => {
    setBusy(true);
    setFilter("");
    service
      .getAll("", 1)
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
  }, []);

  useEffect(() => {
    if (filter !== undefined && filter.length > 0) {
      setFilteredLeaderboard(
        leaderboard.filter((l) => l.nombre.includes(filter))
      );
    } else {
      setFilteredLeaderboard(leaderboard);
    }
  }, [filter]);

  return (
    <div>
      <h1>Leaderboard</h1>

      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={leaderboard.length < 1}>
          <div className="top__three mb-4">
            <h5>Top 3</h5>
            <div className="leaderboard">
              {filteredLeaderboard.map((l) => (
                <div
                  key={l.nombre}
                  className="card border-light leaderboard__line"
                >
                  <div className="card-body ">
                    <div className="leaderboard__left">
                      <div className="leaderboard__nombre">{l.nombre}</div>
                      <div className="leaderboard__puntos">
                        Score: {l.puntos} points
                      </div>
                    </div>
                    <div className="leaderboard__country">{l.pais}</div>
                    <div
                      className={`leaderboard__position leaderboard__position--${l.ranking}`}
                    >
                      <span>{l.ranking}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="others">
            <h5>Others</h5>
            <div className="leaderboard">
              <input
                placeholder="Search..."
                onChange={(content) => setFilter(content.target.value)}
              ></input>
              {filteredLeaderboard.map((l) => (
                <div
                  key={l.nombre}
                  className="card border-light leaderboard__line"
                >
                  <div className="card-body ">
                    <div className="leaderboard__left">
                      <div className="leaderboard__nombre">{l.nombre}</div>
                      <div className="leaderboard__puntos">
                        Score: {l.puntos} points
                      </div>
                    </div>
                    <div className="leaderboard__country">{l.pais}</div>
                    <div className="leaderboard__position">{l.ranking}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </EmptyScreen>
      </LoadingScreen>
    </div>
  );
};

Leaderboard.getLayout = layout;

export default Leaderboard;
