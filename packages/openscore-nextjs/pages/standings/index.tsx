import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import TeamFlag from "../../components/atoms/TeamFlag";
import EmptyScreen from "../../components/molecules/EmptyScreen";
import { layout } from "../../components/templates/MainLayout";
import Standing from "../../model/Standing";
import { StandingsService } from "../../services/StandingsService";
import { userState } from "../../states/SecurityState";
import { NextPageWithLayout } from "../_app";

const Home: NextPageWithLayout = () => {
  const user = useRecoilValue(userState);
  const [standings, setStandings] = useState<Standing[]>([]);

  useEffect(() => {
    const service = new StandingsService();
    service.getAll(0, 0).then((res) => {
      setStandings(res.data.data);
    });
  }, []);
  return (
    <div>
      <h1>Standings</h1>
      <EmptyScreen isEmpty={false}>
        <div className="standings">
          <div className="card shadow">
            <div className="card-header">Group A</div>
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
                  {standings.map((s) => (
                    <tr key={s.equipo.codigo}>
                      <td>
                        <div className="standings__position">1</div>
                      </td>
                      <td className="standings__team">
                        <TeamFlag src={s.equipo.codigo}></TeamFlag>{" "}
                        <span>{s.equipo.nombre}</span>
                      </td>
                      <td>TBD</td>
                      <td>{s.ganados}</td>
                      <td>{s.perdidos}</td>
                      <td>{s.empatados}</td>
                      <td>{s.diferenciaGol}</td>
                      <td>{s.puntos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </EmptyScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
