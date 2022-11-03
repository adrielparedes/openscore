import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Leaderboard from "../components/molecules/Leaderboard";
import { layout } from "../components/templates/MainLayout";
import { useWindowDimensions } from "../hooks/Hooks";
import { Pais } from "../model/Pais";
import { PaisesService } from "../services/PaisesService";
import { NextPageWithLayout } from "./_app";

const getLink = (link: string) => `/leaderboard?filter=${link}`;

interface PaisesSelectorProps {
  onClick: (p: Pais | undefined) => void;
}

const PaisesSelector = ({ onClick }: PaisesSelectorProps) => {
  const [paises, setPaises] = useState<Pais[]>([]);
  const paisesService = new PaisesService();
  const router = useRouter();
  const { width } = useWindowDimensions();
  useEffect(() => {
    paisesService.getAll(0, 10).then((res) => {
      setPaises(res.data.data);
    });
  }, []);

  if (paises.length > 0) {
    if (width > 768) {
      return (
        <div className="forecast__tabs mb-3">
          <ul className="nav nav-pills">
            <li className="nav-item">
              <Link href={"/leaderboard"}>
                <a
                  className={`nav-link ${
                    router.asPath === "/leaderboard" ? "active" : ""
                  }`}
                  aria-current="page"
                  href="#"
                  onClick={() => onClick(undefined)}
                >
                  General
                </a>
              </Link>
            </li>
            {paises.map((f) => (
              <li key={f.codigo} className="nav-item">
                <Link href={getLink(f.codigo)}>
                  <a
                    className={`nav-link ${
                      router.asPath === getLink(f.codigo) ? "active" : ""
                    }`}
                    aria-current="page"
                    href="#"
                    onClick={() => onClick(f)}
                  >
                    {f.nombre}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <select
          className="form-select mb-3"
          aria-label="Default select example"
          onChange={(ev) => {
            if (ev.target.value) {
              console.log(ev.target.value);
            }
            router.push(getLink(ev.target.value));
          }}
          value={router.query["filter"]}
        >
          <option value={""}>General</option>
          {paises.map((f) => (
            <option key={f.codigo} value={f.codigo}>
              {f.nombre}
            </option>
          ))}
        </select>
      );
    }
  } else {
    return <></>;
  }
};

const LeaderboardPage: NextPageWithLayout = () => {
  const [filter, setFilter] = useState("");
  const [pais, setPais] = useState<Pais>();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const q = router.query["filter"] || "";

  useEffect(() => {
    setQuery(q as string);
  }, [q]);

  return (
    <div>
      <h1>Leaderboard</h1>

      <PaisesSelector onClick={(p) => setPais(p)}></PaisesSelector>
      <h3 className="mb-3">{pais?.nombre || "General"} Leaderboard</h3>

      <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          aria-label="Username"
          aria-describedby="basic-addon1"
          onChange={(content) => setFilter(content.target.value)}
        ></input>
      </div>
      <Leaderboard filter={filter} query={query}></Leaderboard>
    </div>
  );
};

LeaderboardPage.getLayout = layout;

export default LeaderboardPage;
