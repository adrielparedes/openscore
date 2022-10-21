import Link from "next/link";
import { useEffect, useState } from "react";
import { SetterOrUpdater } from "recoil";
import Result from "../../../components/atoms/Result";
import StatusIndicator from "../../../components/atoms/StatusIndicator";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import Pagination from "../../../components/molecules/Pagination";
import { layout } from "../../../components/templates/MainLayout";
import { Partido } from "../../../model/Partido";
import { PartidosService } from "../../../services/PartidosService";
import { NextPageWithLayout } from "../../_app";

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/png/${src}`}></img>
  </div>
);

const refresh = (
  service: PartidosService,
  setList: SetterOrUpdater<Partido[]>,
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

const Matches: NextPageWithLayout = () => {
  const service = new PartidosService();
  const [list, setList] = useState<Partido[]>([]);
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
      <h1>Matches</h1>
      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={count < 1}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Local</th>
                <th>Visitor</th>
                <th>Date</th>
                <th>Fase</th>
                <th>Fecha</th>
                <th>Location</th>
                <th>Result</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((elem) => (
                <tr key={elem.id}>
                  <th scope="row">{elem.id}</th>
                  <td>
                    {elem.local.nombre}{" "}
                    <TeamFlag src={elem.local.codigo}></TeamFlag>
                  </td>
                  <td>
                    {elem.visitante.nombre}{" "}
                    <TeamFlag src={elem.visitante.codigo}></TeamFlag>
                  </td>
                  <td>{new Date(elem.dia).toUTCString()}</td>
                  <td>{elem.fase.nombre}</td>
                  <td>{elem.fecha}</td>
                  <td>{elem.lugar}</td>
                  <td>
                    <Result partido={elem}></Result>
                  </td>
                  <td>
                    <StatusIndicator>{elem.status}</StatusIndicator>
                  </td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      href={`/admin/matches/${elem.id}`}
                    >
                      <a className="btn btn-primary">Set Result</a>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={10}>
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

Matches.getLayout = layout;

export default Matches;