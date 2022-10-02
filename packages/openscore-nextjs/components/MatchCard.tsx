import { Partido } from "../model/Partido";

const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/svg/${src}`}></img>
  </div>
);

interface MatchCardProps {
  partido: Partido;
}

const MatchCard = ({ partido }: MatchCardProps) => (
  <div>
    <div className="match card border-light text-center shadow">
      <div className="card-body">
        <h5 className="card-title">FIFA World Cup - Qatar 2022</h5>
        <h6 className="card-subtitle muted mb-3">Round Robin 0 of 3</h6>
        <div className="match__results">
          <TeamFlag src={partido.local.codigo}></TeamFlag>
          <div className="match__score">
            {partido.resultado?.local || "-"} :{" "}
            {partido.resultado?.visitante || "-"}
          </div>
          <TeamFlag src={partido.visitante.codigo}></TeamFlag>
          <div className="match__team">{partido.local.nombre}</div>
          <div className="match__status">36'</div>
          <div className="match__team">{partido.visitante.nombre}</div>
        </div>
        <ul className="match__selection nav nav-pills">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#">
              Draw
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#">
              Away
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default MatchCard;
