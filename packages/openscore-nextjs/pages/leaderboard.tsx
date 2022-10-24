import { useEffect, useState } from "react";
import TeamFlag from "../components/atoms/TeamFlag";
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
      .getAll("", 400)
      .then((res) => {
        setLeaderboard(res.data.data);
        setFilteredLeaderboard(res.data.data);
        console.log(res.data.data);
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
        leaderboard.filter(
          (l) =>
            l.nombre.toLowerCase().includes(filter.toLowerCase()) ||
            l.pais.toLowerCase().includes(filter.toLowerCase())
        )
      );
    } else {
      setFilteredLeaderboard(leaderboard);
    }
  }, [filter]);

  return (
    <div>
      <h1>Leaderboard</h1>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          aria-label="Username"
          aria-describedby="basic-addon1"
          onChange={(content) => setFilter(content.target.value)}
        ></input>
      </div>
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
    </div>
  );
};

Leaderboard.getLayout = layout;

export default Leaderboard;
