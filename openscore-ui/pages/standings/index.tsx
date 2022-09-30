import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import TeamFlag from "../../components/atoms/TeamFlag";
import EmptyScreen from "../../components/molecules/EmptyScreen";
import LoadingScreen from "../../components/molecules/LoadingScreen";
import { layout } from "../../components/templates/MainLayout";
import { Grupo } from "../../model/Grupo";
import Standing from "../../model/Standing";
import { GruposService } from "../../services/GruposService";
import { StandingsService } from "../../services/StandingsService";
import { isAdminState, userState } from "../../states/SecurityState";
import { NextPageWithLayout } from "../_app";

const Home: NextPageWithLayout = () => {
  const user = useRecoilValue(userState);
  const isAdmin = useRecoilValue(isAdminState);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [groups, setGroups] = useState<Grupo[]>([]);
  const [busy, setBusy] = useState(false);
  const service = new StandingsService();
  const groupService = new GruposService();

  const refresh = () => {
    setBusy(true);
    groupService.getAll(0, 10).then((res) => {
      setGroups(res.data.data.filter((g) => g.codigo !== "NONE"));
    });
    service.getAll(0, 0).then((res) => {
      setStandings(res.data.data);
      setBusy(false);
    });
  };

  const calculateAndRefresh = () => {
    service.calculate().then((res) => {
      refresh();
    });
  };

  useEffect(() => {
    refresh();
  }, []);
  return (
    <div>
      <h1>Standings</h1>
      <div className="mb-3">
        {isAdmin ? (
          <button className="btn btn-primary" onClick={() => refresh()}>
            Refresh
          </button>
        ) : (
          <></>
        )}
        {isAdmin ? (
          <button
            className="btn btn-primary ms-3"
            onClick={() => calculateAndRefresh()}
          >
            Calculate And Refresh
          </button>
        ) : (
          <></>
        )}
      </div>
      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={standings.length < 1}>
          <div className="standings">
            {groups.map((g) => (
              <div key={g.codigo} className="card shadow">
                <div className="card-header">{g.nombre}</div>
                <div className="card-body">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>G/D</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings
                        .filter((s) => s.grupo.codigo === g.codigo)
                        .map((s, i) => (
                          <tr key={s.equipo.codigo}>
                            <td>
                              <div className="standings__position">{i + 1}</div>
                            </td>
                            <td className="standings__team">
                              <TeamFlag src={s.equipo.codigo}></TeamFlag>{" "}
                              <span>{s.equipo.nombre}</span>
                            </td>
                            <td>{s.partidos}</td>
                            <td>{s.ganados}</td>
                            <td>{s.empatados}</td>
                            <td>{s.perdidos}</td>
                            <td>{s.diferenciaGol}</td>
                            <td>{s.puntos}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </EmptyScreen>
      </LoadingScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
