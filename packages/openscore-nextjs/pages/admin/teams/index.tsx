import { useEffect, useState } from "react";
import { SetterOrUpdater } from "recoil";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import Pagination from "../../../components/molecules/Pagination";
import { layout } from "../../../components/templates/MainLayout";
import { Equipo } from "../../../model/Equipo";
import { EquiposService } from "../../../services/EquiposService";
import { NextPageWithLayout } from "../../_app";

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/png/${src}`}></img>
  </div>
);

const refresh = (
  service: EquiposService,
  setList: SetterOrUpdater<Equipo[]>,
  page: number,
  pageSize: number,
  setBusy: SetterOrUpdater<boolean>
) => {
  setBusy(true);
  service.getAll(page, pageSize).then((res) => {
    setList(res.data.data);
    setBusy(false);
  });
};

const Teams: NextPageWithLayout = () => {
  const service = new EquiposService();
  const [list, setList] = useState<Equipo[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    refresh(service, setList, page, 10, setBusy);

    service.count().then((res) => {
      setCount(res.data.data);
    });
  }, [setList, setCount, page]);

  return (
    <div>
      <h1>Teams</h1>
      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={count < 1}>
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
            <tfoot>
              <tr>
                <td>
                  <Pagination
                    page={page}
                    setPage={(p: number) => {
                      setPage(p);
                    }}
                    pageSize={10}
                    count={count}
                  ></Pagination>
                </td>
              </tr>
            </tfoot>
          </table>
        </EmptyScreen>
      </LoadingScreen>
    </div>
  );
};

Teams.getLayout = layout;

export default Teams;
