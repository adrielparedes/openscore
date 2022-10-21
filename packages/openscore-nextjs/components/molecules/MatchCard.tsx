import { AxiosError, AxiosPromise } from "axios";
import { PropsWithChildren, useState } from "react";
import { toast } from "react-toastify";
import { ApiResponse } from "../../model/ApiResponse";
import Ganador from "../../model/Ganador";
import { Partido } from "../../model/Partido";
import { PronosticoService } from "../../services/PronosticoService";
import Countdown from "../atoms/Countdown";
import Result from "../atoms/Result";
import StatusIndicator from "../atoms/StatusIndicator";

const pronosticoService = new PronosticoService();

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag shadow">
    <img src={`https://countryflagsapi.com/png/${src}`}></img>
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

const PhaseIndicator = ({ partido }: { partido: Partido }) => {
  const dia = new Date(partido.dia);
  if (partido.fase.codigo === "GRUPO") {
    return (
      <h6 className="card-subtitle">
        {`Round Robin: ${partido.grupo.nombre} - ${
          partido.fecha
        } of 3 - ${dia.toDateString()} ${dia.toLocaleTimeString()}`}
      </h6>
    );
  } else {
    return (
      <h6 className="card-subtitle muted mb-3">
        {`${partido.fase.nombre} ${new Date(partido.dia).toLocaleString()}`}
      </h6>
    );
  }
};

const getMatchResult = (partido: Partido) => {
  var resultado = Ganador.NONE;

  if (partido.resultado) {
    const { penales, penalesLocal, penalesVisitante, local, visitante } =
      partido.resultado;
    if (local !== undefined && visitante !== undefined) {
      if (
        penales &&
        penalesLocal !== undefined &&
        penalesVisitante !== undefined
      ) {
        if (penalesLocal > penalesVisitante) {
          resultado = Ganador.LOCAL;
        } else if (penalesLocal < penalesVisitante) {
          resultado = Ganador.VISITANTE;
        } else {
          resultado = Ganador.EMPATE;
        }
      } else {
        if (local > visitante) {
          resultado = Ganador.LOCAL;
        } else if (local < visitante) {
          resultado = Ganador.VISITANTE;
        } else {
          resultado = Ganador.EMPATE;
        }
      }
    }
  }

  return resultado;
};

const getMatchResultCss = (partido: Partido) => {
  const result = getMatchResult(partido);

  if (partido.status === "FINISHED") {
    switch (result) {
      case Ganador.NONE:
        return "not_finished";
      case Ganador.EMPATE:
        return partido.pronostico?.empate ? "hit" : "not_hit";
      case Ganador.LOCAL:
        return partido.pronostico?.local ? "hit" : "not_hit";
      case Ganador.VISITANTE:
        return partido.pronostico?.visitante ? "hit" : "not_hit";
      default:
        return "not_hit";
    }
  } else {
    return "not_finished";
  }
};

const Footer = ({ partido }: { partido: Partido }) => {
  switch (getMatchResultCss(partido)) {
    case "hit":
      return (
        <div className="card-footer bg-success text-bg-dark">Well done!!!</div>
      );
    case "not_hit":
      return (
        <div className="card-footer bg-danger text-bg-dark">
          Better luck next time!
        </div>
      );
    default:
      return (
        <div className="card-footer">
          <Countdown date={partido.dia}></Countdown>
        </div>
      );
  }
};

const MatchCard = ({ partido, onUpdate }: MatchCardProps) => {
  return (
    <div
      className={`match card border-light text-center shadow match--${partido.status.toLowerCase()} match__result--${getMatchResultCss(
        partido
      )}`}
    >
      <div className="card-header">
        <PhaseIndicator partido={partido}></PhaseIndicator>
      </div>
      <div className="card-body">
        {/* <h5 className="card-title">FIFA World Cup - Qatar 2022</h5> */}
        <div className="match__results">
          <TeamFlag src={partido.local.codigo}></TeamFlag>
          <Result className="match__score" partido={partido}></Result>
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
      <Footer partido={partido}></Footer>
    </div>
  );
};

export default MatchCard;
