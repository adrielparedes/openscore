import { Partido } from "../../model/Partido";

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

export default PhaseIndicator;
