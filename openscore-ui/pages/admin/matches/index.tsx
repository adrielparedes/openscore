import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SetterOrUpdater, useRecoilValue } from "recoil";
import PhaseIndicator from "../../../components/atoms/PhaseIndicator";
import Result from "../../../components/atoms/Result";
import StatusIndicator from "../../../components/atoms/StatusIndicator";
import TeamFlag from "../../../components/atoms/TeamFlag";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import Pagination from "../../../components/molecules/Pagination";
import { layout } from "../../../components/templates/MainLayout";
import { useSecure, useWindowDimensions } from "../../../hooks/Hooks";
import { Partido } from "../../../model/Partido";
import { PartidosService } from "../../../services/PartidosService";
import { isAdminState } from "../../../states/SecurityState";
import { NextPageWithLayout } from "../../_app";

const service: PartidosService = new PartidosService();

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

const Actions = ({
  elem,
  update,
}: {
  elem: Partido;
  update: (p: Partido) => void;
}) => {
  return (
    <div className="btn-group">
      <Link
        className="btn btn-primary"
        href={`/admin/matches/results/${elem.id}`}
      >
        <a className="btn btn-primary">Set Result</a>
      </Link>
      <Link className="btn btn-primary" href={`/admin/matches/${elem.id}`}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button
        className="btn btn-danger"
        onClick={() => {
          service
            .delete(elem.id)
            .then((res) => {
              toast.success(
                `${elem.local.codigo}-${elem.visitante.codigo} deleted successfully`
              );
              update(elem);
            })
            .catch((err) => {
              console.log(err);
              toast.error(
                `Can't deleted ${elem.local.codigo}-${elem.visitante.codigo}`
              );
            });
        }}
      >
        Delete
      </button>
    </div>
  );
};

const TableView = ({
  list,
  update,
}: {
  list: Partido[];
  update: (p: Partido) => void;
}) => {
  return (
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
              {elem.local.nombre} <TeamFlag src={elem.local.codigo}></TeamFlag>
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
              <Actions elem={elem} update={update}></Actions>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CardView = ({
  list,
  update,
}: {
  list: Partido[];
  update: (p: Partido) => void;
}) => {
  return (
    <div className="forecast__matches">
      {list.map((elem) => (
        <div key={elem.id} className="card">
          <div className="card-header">
            <PhaseIndicator partido={elem}></PhaseIndicator>
          </div>
          <div className="match card-body border-light text-center shadow">
            <div className="match__results">
              <TeamFlag src={elem.local.codigo}></TeamFlag>
              <Result className="match__score" partido={elem}></Result>
              <TeamFlag src={elem.visitante.codigo}></TeamFlag>
              <div className="match__team">{elem.local.nombre}</div>
              <StatusIndicator>{elem.status}</StatusIndicator>
              <div className="match__team">{elem.visitante.nombre}</div>
            </div>
            <Actions elem={elem} update={update}></Actions>
          </div>
        </div>
      ))}
    </div>
  );
};

const Matches: NextPageWithLayout = () => {
  useSecure(["admin"], "/");
  const [list, setList] = useState<Partido[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);
  const isAdmin = useRecoilValue(isAdminState);
  const { width } = useWindowDimensions();
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
        <Link href={`/admin/matches/0`}>
          <a className="btn btn-primary">Create Match</a>
        </Link>
        <EmptyScreen isEmpty={count < 1}></EmptyScreen>
        {width > 768 ? (
          <TableView
            list={list}
            update={(p) => {
              refresh(service, setList, page, 10, setBusy);
            }}
          ></TableView>
        ) : (
          <CardView
            list={list}
            update={(p) => {
              refresh(service, setList, page, 10, setBusy);
            }}
          ></CardView>
        )}
        <Pagination
          page={page}
          setPage={(p: number) => {
            setPage(p);
          }}
          pageSize={10}
          count={count}
        ></Pagination>
      </LoadingScreen>
    </div>
  );
};

Matches.getLayout = layout;

export default Matches;
