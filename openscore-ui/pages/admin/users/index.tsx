import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SetterOrUpdater } from "recoil";
import TeamFlag from "../../../components/atoms/TeamFlag";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import Pagination from "../../../components/molecules/Pagination";
import { layout } from "../../../components/templates/MainLayout";
import { useSecure, useWindowDimensions } from "../../../hooks/Hooks";
import { UsuarioCompleto } from "../../../model/UsuarioCompleto";
import { UsuarioService } from "../../../services/UsuarioService";
import { NextPageWithLayout } from "../../_app";

const refresh = (
  service: UsuarioService,
  setList: SetterOrUpdater<UsuarioCompleto[]>,
  page: number,
  pageSize: number,
  setBusy: SetterOrUpdater<boolean>
) => {
  setBusy(true);
  service.allAdmin(page, pageSize).then((res) => {
    setList(res.data.data);
    setBusy(false);
  });
};

const Actions = ({
  elem,
  service,
}: {
  elem: UsuarioCompleto;
  service: UsuarioService;
}) => {
  return (
    <div className="btn-group">
      <button
        className="btn btn-success"
        onClick={() => {
          service
            .enable(elem.id)
            .then((res) => {
              toast.success(`${elem.email} enabled successfully`);
            })
            .catch((err) => {
              console.log(err);
              toast.error(`Can't enable ${elem.email}`);
            });
        }}
      >
        Enable
      </button>
      <button
        className="btn btn-danger"
        onClick={() => {
          service
            .disable(elem.id)
            .then((res) => {
              toast.success(`${elem.email} disabled successfully`);
            })
            .catch((err) => {
              console.log(err);
              toast.error(`Can't deleted ${elem.email}`);
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
  service,
}: {
  list: UsuarioCompleto[];
  service: UsuarioService;
}) => {
  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Pais</th>
          <th>Eliminado</th>
          <th>Fecha de creacion</th>
          <th>Fecha de modificacion</th>
          <th>Fecha de Eliminacion</th>
          <th>Token</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {list.map((elem) => (
          <tr key={elem.id}>
            <th scope="row">{elem.id}</th>
            <td>{elem.nombre}</td>
            <td>{elem.apellido}</td>
            <td>{elem.email}</td>
            <td>
              {elem.pais.nombre} <TeamFlag src={elem.pais.codigo}></TeamFlag>
            </td>
            <td>{elem.deleted ? "true" : "false"}</td>
            <td>{new Date(elem.creationDate).toUTCString()}</td>
            <td>{new Date(elem.modificationDate).toUTCString()}</td>
            <td>
              {elem.deletionDate
                ? new Date(elem.deletionDate).toUTCString()
                : "-"}
            </td>
            <td>-</td>
            <td>
              <Actions elem={elem} service={service}></Actions>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CardView = ({
  list,
  service,
}: {
  list: UsuarioCompleto[];
  service: UsuarioService;
}) => {
  return (
    <div className="forecast__matches">
      {list.map((elem) => (
        <div key={elem.id} className="card">
          <div className="card-header"></div>
          <div className="match card-body border-light text-center shadow">
            <Actions elem={elem} service={service}></Actions>
          </div>
        </div>
      ))}
    </div>
  );
};

const Users: NextPageWithLayout = () => {
  useSecure(["admin"], "/");
  const service = new UsuarioService();
  const [list, setList] = useState<UsuarioCompleto[]>([]);
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [busy, setBusy] = useState<boolean>(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    refresh(service, setList, page, 10, setBusy);
    service
      .count()
      .then((res) => {
        setCount(res.data.data);
      })
      .catch((err) => {
        setCount(0);
      });
  }, [setList, setCount, page]);

  return (
    <div>
      <h1>Users</h1>
      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={count < 1}></EmptyScreen>
        {width > 768 ? (
          <TableView list={list} service={service}></TableView>
        ) : (
          <CardView list={list} service={service}></CardView>
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

Users.getLayout = layout;

export default Users;
