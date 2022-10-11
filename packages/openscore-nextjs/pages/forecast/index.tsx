import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { SetterOrUpdater, useRecoilValue, useSetRecoilState } from "recoil";
import EmptyScreen from "../../components/EmptyScreen";
import { layout } from "../../components/layout/MainLayout";
import LoadingScreen from "../../components/LoadingScreen";
import MatchCard from "../../components/MatchCard";
import { Partido } from "../../model/Partido";
import { PronosticoService } from "../../services/PronosticoService";
import {
  ForecastFilter,
  forecastFilterState,
  forecastListState,
} from "../../states/ForecastState";
import { NextPageWithLayout } from "../_app";

const filters = [
  {
    name: "All",
    link: "all",
    filter: ForecastFilter.ALL,
  },
  {
    name: "Today",
    link: "today",
    filter: ForecastFilter.TODAY,
  },
];

const pronostico = new PronosticoService();

const refresh = (
  setForecast: SetterOrUpdater<Partido[]>,
  setBusy: SetterOrUpdater<boolean>
) => {
  setBusy(true);
  pronostico
    .getAll(1, 1)
    .then((res) => {
      setForecast(res.data.data);
      setBusy(false);
    })
    .catch((err) => {
      setForecast([]);
      setBusy(false);
    });
};

const getLink = (link: string) => `/forecast?filter=${link}`;

const Forecasts: NextPageWithLayout = () => {
  const router = useRouter();
  const filteredForecast = useRecoilValue(forecastListState);
  const setFilter = useSetRecoilState(forecastFilterState);
  const setForecast = useSetRecoilState(forecastListState);

  const [busy, setBusy] = useState(false);
  const filter = filters.find((f) => f.link === router.query["filter"]);

  useEffect(() => {
    if (router.query["filter"] === undefined) {
      router.push(`/forecast?filter=all`);
    }
    setFilter(filter?.filter || ForecastFilter.ALL);
    refresh(setForecast, setBusy);
  }, [setForecast, filter]);

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
        <LoadingScreen busy={busy}>
          <EmptyScreen isEmpty={filteredForecast.length < 1}>
            <div className="forecast__matches">
              {filteredForecast.map((f) => (
                <MatchCard
                  key={f.id}
                  partido={f}
                  onUpdate={() => {
                    refresh(setForecast, setBusy);
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
