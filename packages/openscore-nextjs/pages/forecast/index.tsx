import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SetterOrUpdater, useRecoilState } from "recoil";
import EmptyScreen from "../../components/EmptyScreen";
import { layout } from "../../components/layout/MainLayout";
import LoadingScreen from "../../components/LoadingScreen";
import MatchCard from "../../components/MatchCard";
import { Partido } from "../../model/Partido";
import { PronosticoService } from "../../services/PronosticoService";
import { forecastListState } from "../../states/ForecastState";
import { NextPageWithLayout } from "../_app";

const filters = [
  {
    name: "Today",
    link: "today",
  },
  {
    name: "Remaining",
    link: "remaining",
  },
];

const pronostico = new PronosticoService();

const refresh = (setForecast: SetterOrUpdater<Partido[]>) => {
  pronostico.getAll(1, 1).then((res) => setForecast(res.data.data));
};

const getLink = (link: string) => `/forecast?filter=${link}`;

const Forecasts: NextPageWithLayout = () => {
  const router = useRouter();
  const [forecast, setForecast] = useRecoilState(forecastListState);
  const { filter } = router.query;
  const path = router.asPath;

  useEffect(() => {
    refresh(setForecast);
  }, [filter, setForecast]);

  return (
    <div className="forecast">
      <h1>Forecast</h1>
      <div className="forecast__main">
        <div className="forecast__tabs">
          <ul className="nav nav-pills">
            {filters.map((f) => (
              <li key={f.name} className="nav-item">
                <Link href={getLink(f.link)}>
                  <a
                    className={`nav-link ${
                      router.asPath === getLink(f.link) ? "active" : ""
                    }`}
                    aria-current="page"
                    href="#"
                  >
                    {f.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <LoadingScreen busy={false}>
          <EmptyScreen isEmpty={forecast.length < 1}>
            <div className="forecast__matches">
              {forecast.map((f) => (
                <MatchCard
                  key={f.id}
                  partido={f}
                  onUpdate={() => {
                    refresh(setForecast);
                  }}
                ></MatchCard>
              ))}
            </div>
          </EmptyScreen>
        </LoadingScreen>
      </div>
    </div>
  );
};

Forecasts.getLayout = layout;

export default Forecasts;
