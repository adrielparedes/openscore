import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import Time from "../../components/atoms/Time";
import EmptyScreen from "../../components/molecules/EmptyScreen";
import LoadingScreen from "../../components/molecules/LoadingScreen";
import MatchCard from "../../components/molecules/MatchCard";
import { layout } from "../../components/templates/MainLayout";
import { useWindowDimensions } from "../../hooks/Hooks";
import { Partido } from "../../model/Partido";
import { PronosticoService } from "../../services/PronosticoService";
import {
  filteredForecastState,
  ForecastFilter,
  forecastFilterState,
  forecastListState,
} from "../../states/ForecastState";
import { NextPageWithLayout } from "../_app";

const filters = [
  {
    name: "Today",
    link: "today",
    filter: ForecastFilter.TODAY,
  },
  {
    name: "Remaining",
    link: "remaining",
    filter: ForecastFilter.REMAINING,
  },
  {
    name: "Round of 16",
    link: "round_16",
    filter: ForecastFilter.ROUND_16,
  },
  {
    name: "Quarter Final",
    link: "quarter",
    filter: ForecastFilter.QUARTER,
  },
  {
    name: "Semifinal",
    link: "semi",
    filter: ForecastFilter.SEMI,
  },
  {
    name: "Final",
    link: "final",
    filter: ForecastFilter.FINAL,
  },
  {
    name: "Group A",
    link: "group_a",
    filter: ForecastFilter.GROUP_A,
  },
  {
    name: "Group B",
    link: "group_b",
    filter: ForecastFilter.GROUP_B,
  },
  {
    name: "Group C",
    link: "group_c",
    filter: ForecastFilter.GROUP_C,
  },
  {
    name: "Group D",
    link: "group_d",
    filter: ForecastFilter.GROUP_D,
  },
  {
    name: "Group E",
    link: "group_e",
    filter: ForecastFilter.GROUP_E,
  },
  {
    name: "Group F",
    link: "group_f",
    filter: ForecastFilter.GROUP_F,
  },
  {
    name: "Group G",
    link: "group_g",
    filter: ForecastFilter.GROUP_G,
  },
  {
    name: "Group H",
    link: "group_h",
    filter: ForecastFilter.GROUP_H,
  },
  {
    name: "All",
    link: "all",
    filter: ForecastFilter.ALL,
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

const Tabs = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const [filter, setFilter] = useState("today");

  useEffect(() => {
    if (router.isReady) {
      if (router.query["filter"] !== undefined) {
        setFilter(router.query["filter"] as string);
      }
    }
  }, [router]);

  if (width > 768) {
    return (
      <div className="forecast__tabs">
        <ul className="nav nav-pills">
          {filters.map((f) => (
            <li key={f.name} className="nav-item">
              <Link href={getLink(f.link)}>
                <a
                  className={`nav-link ${filter === f.link ? "active" : ""}`}
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
    );
  } else {
    return (
      <select
        className="form-select"
        aria-label="Default select example"
        onChange={(ev) => {
          router.push(getLink(ev.target.value));
        }}
        value={filter}
      >
        {filters.map((f) => (
          <option key={f.name} value={f.link}>
            {f.name}
          </option>
        ))}
      </select>
    );
  }
};

const Forecasts: NextPageWithLayout = () => {
  const router = useRouter();
  const [_, setForecast] = useRecoilState(forecastListState);
  const filteredForecast = useRecoilValue(filteredForecastState);
  const setFilter = useSetRecoilState(forecastFilterState);
  const [path, setPath] = useState("");
  const [busy, setBusy] = useState(false);
  const filter = filters.find((f) => f.link === router.query["filter"]);

  useEffect(() => {
    setBusy(true);
    if (router.isReady) {
      if (router.query["filter"] === undefined) {
        router.push(`/forecast?filter=today`);
      }

      setPath(router.asPath);

      setFilter(filter?.filter || ForecastFilter.ALL);
      refresh(setForecast, setBusy);
    }
  }, [setForecast, filter, router]);

  return (
    <div className="forecast">
      <h1>Forecast</h1>
      <div className="forecast__main">
        <Time></Time>
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          The matches will be blocked <strong>15 minutes</strong> before the
          match!
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
        <Tabs></Tabs>
        <LoadingScreen busy={busy}>
          <EmptyScreen isEmpty={filteredForecast.length < 1}>
            <div className="forecast__matches">
              {filteredForecast.map((f) => (
                <MatchCard
                  key={f.id}
                  partido={f}
                  onUpdate={(partido) => {}}
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
