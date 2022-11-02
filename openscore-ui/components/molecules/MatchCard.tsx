import { AxiosError, AxiosPromise } from "axios";
import { PropsWithChildren, useState } from "react";
import { toast } from "react-toastify";
import { SetterOrUpdater, useRecoilState } from "recoil";
import { ApiResponse } from "../../model/ApiResponse";
import Ganador from "../../model/Ganador";
import { Partido } from "../../model/Partido";
import { PronosticoService } from "../../services/PronosticoService";
import { forecastListState } from "../../states/ForecastState";
import Countdown from "../atoms/Countdown";
import PhaseIndicator from "../atoms/PhaseIndicator";
import Result from "../atoms/Result";
import StatusIndicator from "../atoms/StatusIndicator";
import TeamFlag from "../atoms/TeamFlag";

const pronosticoService = new PronosticoService();

interface MatchCardProps {
  partido: Partido;
  onUpdate: (p: Partido) => void;
}

const ActiveNavLink = ({
  id,
  active,
  children,
  select,
  onUpdate,
  busy,
  setBusy,
}: {
  active: boolean;
  id: number;
  select: (id: number) => AxiosPromise;
  onUpdate: () => void;
  busy: boolean;
  setBusy: SetterOrUpdater<boolean>;
} & PropsWithChildren) => {
  const [loading, setLoading] = useState(false);
  const [forecast, setForecast] = useRecoilState(forecastListState);
  return (
    <li className={`nav-item`}>
      <a
        className={`nav-link ${active ? "active" : ""} ${
          busy ? "disabled" : ""
        }`}
        aria-current="page"
        onClick={() => {
          setBusy(true);
          setLoading(true);
          select(id)
            .then((res) => {
              setForecast((prev) => {
                const list = [...prev];
                const index: number = list.findIndex(
                  (f) => f.id === res.data.data.id
                );
                if (index !== -1) {
                  list[index] = res.data.data;
                }
                return list;
              });

              setBusy(false);
              setLoading(false);
              onUpdate();
            })
            .catch((err: AxiosError<ApiResponse<string>>) => {
              toast.error(err.response?.data?.description || "");
              setLoading(false);
            });
        }}
      >
        {loading ? (
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

const Footer = ({
  partido,
  blocked,
}: {
  partido: Partido;
  blocked: (blocked: boolean) => void;
}) => {
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
          <Countdown
            date={partido.dia}
            blocked={(b) => {
              blocked(b);
            }}
          ></Countdown>
        </div>
      );
  }
};

const MatchCard = ({ partido, onUpdate }: MatchCardProps) => {
  const [busy, setBusy] = useState(false);
  const [forecast, setForecast] = useRecoilState(forecastListState);
  const [blocked, setBlocked] = useState(false);
  return (
    <div
      className={`match card border-light text-center shadow match--${partido.status.toLowerCase()} match__result--${getMatchResultCss(
        partido
      )} ${blocked ? "match--blocked" : ""}`}
    >
      <div className="card-header">
        <PhaseIndicator partido={partido}></PhaseIndicator>
      </div>
      <div className="card-body">
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
            onUpdate={() => onUpdate(partido)}
            busy={busy}
            setBusy={setBusy}
          >
            Home
          </ActiveNavLink>
          <ActiveNavLink
            active={partido.pronostico?.empate || false}
            id={partido.id}
            select={(id) => pronosticoService.empate(id)}
            onUpdate={() => onUpdate(partido)}
            busy={busy}
            setBusy={setBusy}
          >
            Draw
          </ActiveNavLink>
          <ActiveNavLink
            active={partido.pronostico?.visitante || false}
            id={partido.id}
            select={(id) => pronosticoService.visitante(id)}
            onUpdate={() => onUpdate(partido)}
            busy={busy}
            setBusy={setBusy}
          >
            Away
          </ActiveNavLink>
        </ul>
      </div>
      <Footer
        partido={partido}
        blocked={(blocked) => setBlocked(blocked)}
      ></Footer>
    </div>
  );
};

export default MatchCard;
