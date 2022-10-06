import { AxiosError, AxiosPromise } from "axios";
import { PropsWithChildren, useState } from "react";
import { toast } from "react-toastify";
import { ApiResponse } from "../model/ApiResponse";
import { Partido } from "../model/Partido";
import { PronosticoService } from "../services/PronosticoService";

const pronosticoService = new PronosticoService();

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/svg/${src}`}></img>
  </div>
);

interface MatchCardProps {
  partido: Partido;
  onUpdate: () => void;
}

const ActiveNavLink = ({
  id,
  active,
  children,
  select,
  onUpdate,
}: {
  active: boolean;
  id: number;
  select: (id: number) => AxiosPromise;
  onUpdate: () => void;
} & PropsWithChildren) => {
  const [busy, setBusy] = useState(false);
  return (
    <li className={`nav-item`}>
      <a
        className={`nav-link ${active ? "active" : ""} `}
        aria-current="page"
        onClick={() => {
          setBusy(true);
          select(id)
            .then((res) => {
              toast.success(res.data.description);
              setBusy(false);
              onUpdate();
            })
            .catch((err: AxiosError<ApiResponse<string>>) => {
              toast.error(err.response?.data.description || "");
              setBusy(false);
            });
        }}
      >
        {busy ? (
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
        ) : (
          <></>
        )}
        {children}
      </a>
    </li>
  );
};

const StatusIndicator = ({ children }: PropsWithChildren) => (
  <div
    className={`match__status badge rounded-pill ${
      children === "BLOCKED" ? "text-bg-primary" : "text-bg-info"
    }`}
  >
    {children}
  </div>
);

const MatchCard = ({ partido, onUpdate }: MatchCardProps) => {
  return (
    <div
      className={`match card border-light text-center shadow match--${partido.status.toLowerCase()}`}
    >
      <div className="card-body">
        <h5 className="card-title">FIFA World Cup - Qatar 2022</h5>
        <h6 className="card-subtitle muted mb-3">
          {partido.fase.nombre} Phase {partido.fecha} of 3 -{" "}
          {new Date(partido.dia).toLocaleString()}
        </h6>
        <div className="match__results">
          <TeamFlag src={partido.local.codigo}></TeamFlag>
          <div className="match__score">
            {partido.resultado?.local || "-"} :{" "}
            {partido.resultado?.visitante || "-"}
          </div>
          <TeamFlag src={partido.visitante.codigo}></TeamFlag>
          <div className="match__team">{partido.local.nombre}</div>
          <StatusIndicator>{partido.status}</StatusIndicator>
          <div className="match__team">{partido.visitante.nombre}</div>
        </div>
        <ul className="match__selection nav nav-pills">
          <ActiveNavLink
            active={partido.pronostico?.local || false}
            id={partido.id}
            select={(id) => pronosticoService.local(id)}
            onUpdate={onUpdate}
          >
            Home
          </ActiveNavLink>
          <ActiveNavLink
            active={partido.pronostico?.empate || false}
            id={partido.id}
            select={(id) => pronosticoService.empate(id)}
            onUpdate={onUpdate}
          >
            Draw
          </ActiveNavLink>
          <ActiveNavLink
            active={partido.pronostico?.visitante || false}
            id={partido.id}
            select={(id) => pronosticoService.visitante(id)}
            onUpdate={onUpdate}
          >
            Away
          </ActiveNavLink>
        </ul>
      </div>
    </div>
  );
};

export default MatchCard;
