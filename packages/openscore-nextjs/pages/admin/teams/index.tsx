import { useEffect, useState } from "react";
import { layout } from "../../../components/templates/MainLayout";
import { Equipo } from "../../../model/Equipo";
import { EquiposService } from "../../../services/EquiposService";
import { NextPageWithLayout } from "../../_app";

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/png/${src}`}></img>
  </div>
);

const Teams: NextPageWithLayout = () => {
  const service = new EquiposService();
  const [list, setList] = useState<Equipo[]>([]);

  useEffect(() => {
    service.getAll(1, 10).then((res) => {
      console.log(res.data.data);
      setList(res.data.data);
    });
  }, [setList]);

  return (
    <div>
      <h1>Teams</h1>
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Logo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {list.map((elem) => (
              <tr key={elem.id}>
                <th scope="row">{elem.id}</th>
                <td>{elem.codigo}</td>
                <td>{elem.nombre}</td>
                <td>
                  <TeamFlag src={elem.codigo}></TeamFlag>
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Teams.getLayout = layout;

export default Teams;
