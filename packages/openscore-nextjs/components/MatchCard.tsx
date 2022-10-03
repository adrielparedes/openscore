import { AxiosError } from "axios";
import { PropsWithChildren } from "react";
import { toast } from "react-toastify";
import { ApiResponse } from "../model/ApiResponse";
import { Partido } from "../model/Partido";
import { PronosticoService } from "../services/PronosticoService";

const pronostico = new PronosticoService();

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/svg/${src}`}></img>
  </div>
);

interface MatchCardProps {
  partido: Partido;
}

const ActiveNavLink = ({
  id,
  active,
  children,
}: { active: boolean; id: number } & PropsWithChildren) => (
  <a
    className={`nav-link ${active ? "active" : ""}`}
    aria-current="page"
    onClick={() => {
      console.log(id);
      pronostico
        .local(id)
        .then((res) => {
          console.log(res);
          toast.success(res.data.description);
        })
        .catch((err: AxiosError<ApiResponse<string>>) => {
          console.log(err);
          toast.error(err.response?.data.description || "");
        });
    }}
  >
    {children}
  </a>
);

const MatchCard = ({ partido }: MatchCardProps) => (
  <div>
    <div className="match card border-light text-center shadow">
      <div className="card-body">
        <h5 className="card-title">FIFA World Cup - Qatar 2022</h5>
        <h6 className="card-subtitle muted mb-3">
          {partido.fase.nombre} Phase {partido.fecha} of 3
        </h6>
        <div className="match__results">
          <TeamFlag src={partido.local.codigo}></TeamFlag>
          <div className="match__score">
            {partido.resultado?.local || "-"} :{" "}
            {partido.resultado?.visitante || "-"}
          </div>
          <TeamFlag src={partido.visitante.codigo}></TeamFlag>
          <div className="match__team">{partido.local.nombre}</div>
          <div className="match__status">{partido.status}</div>
          <div className="match__team">{partido.visitante.nombre}</div>
        </div>
        <ul className="match__selection nav nav-pills">
          <li className="nav-item">
            <ActiveNavLink
              active={partido.pronostico?.local || false}
              id={partido.id}
            >
              Home
            </ActiveNavLink>
          </li>
          <li className="nav-item">
            <ActiveNavLink
              active={partido.pronostico?.empate || false}
              id={partido.id}
            >
              Draw
            </ActiveNavLink>
          </li>
          <li className="nav-item">
            <ActiveNavLink
              active={partido.pronostico?.visitante || false}
              id={partido.id}
            >
              Away
            </ActiveNavLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default MatchCard;
