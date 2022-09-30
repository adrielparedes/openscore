import { Partido } from "../../model/Partido";

const Result = ({
  partido,
  className,
}: {
  partido: Partido;
  className?: string;
}) => {
  return (
    <div className={`${className || ""}`}>{`${
      partido.resultado?.local == undefined ? "-" : partido.resultado.local
    }${
      partido.resultado?.penales ? `(${partido.resultado.penalesLocal})` : ""
    } : ${
      partido.resultado?.visitante == undefined
        ? "-"
        : partido.resultado.visitante
    }${
      partido.resultado?.penales
        ? `(${partido.resultado.penalesVisitante})`
        : ""
    }`}</div>
  );
};

export default Result;
