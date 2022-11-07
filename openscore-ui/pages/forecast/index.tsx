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
import FilteredPage from "../../components/molecules/FilteredPage";
import LoadingScreen from "../../components/molecules/LoadingScreen";
import MatchCard from "../../components/molecules/MatchCard";
import { layout } from "../../components/templates/MainLayout";
import { Partido } from "../../model/Partido";
import { PronosticoService } from "../../services/PronosticoService";
import {
  filteredForecastState,
  ForecastFilter,
  forecastFilterState,
  forecastListState,
} from "../../states/ForecastState";
import { NextPageWithLayout } from "../_app";

interface Menu {
  name: string;
  link: string;
  filter: ForecastFilter;
}

const filters: Menu[] = [
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
    name: "Final",
    link: "final",
    filter: ForecastFilter.FINAL,
  },
  {
    name: "Third Place",
    link: "third_place",
    filter: ForecastFilter.FINAL,
  },
  {
    name: "Semifinal",
    link: "semifinal",
    filter: ForecastFilter.SEMI,
  },

  {
    name: "Quarter Finals",
    link: "quarter_finals",
    filter: ForecastFilter.QUARTER,
  },
  {
    name: "Round of 16",
    link: "round_of_16",
    filter: ForecastFilter.ROUND_16,
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
  setBusy: SetterOrUpdater<boolean>,
  setMenu: SetterOrUpdater<Menu[]>
) => {
  setBusy(true);
  pronostico
    .getAll(1, 1)
    .then((res) => {
      setForecast(res.data.data);
      setMenu(
        filters.filter(
          (f) =>
            res.data.data.find((fore) => {
              return (
                fore.grupo.nombre.replaceAll(" ", "_").toUpperCase() ===
                  f.link.toUpperCase() ||
                fore.fase.nombre.replaceAll(" ", "_").toUpperCase() ===
                  f.link.toUpperCase() ||
                f.link === "today" ||
                f.link === "all" ||
                f.link === "remaining"
              );
            }) !== undefined
        )
      );

      setBusy(false);
    })
    .catch((err) => {
      setForecast([]);
      setMenu([]);
      setBusy(false);
    });
};

const getLink = (link: string) => `/forecast?filter=${link}`;

const Forecasts: NextPageWithLayout = () => {
  const router = useRouter();
  const [forecast, setForecast] = useRecoilState(forecastListState);
  const filteredForecast = useRecoilValue(filteredForecastState);
  const setFilter = useSetRecoilState(forecastFilterState);
  const [_, setPath] = useState("");
  const [busy, setBusy] = useState(false);
  const filter = filters.find((f) => f.link === router.query["filter"]);

  const [menu, setMenu] = useState<Menu[]>([]);

  useEffect(() => {
    setBusy(true);
    if (router.isReady) {
      if (router.query["filter"] === undefined) {
        router.push(`/forecast?filter=today`);
      }

      setPath(router.asPath);

      setFilter(filter?.filter || ForecastFilter.ALL);
      refresh(setForecast, setBusy, setMenu);
    }
  }, [setForecast, filter, router, filters, setForecast]);

  return (
    <div className="forecast">
      <h1>Forecast</h1>
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
      <FilteredPage
        filters={menu.map((f) => {
          return { code: f.link, name: f.name };
        })}
        link="/forecast"
        select={() => {}}
      >
        <div className="forecast__main">
          <Time></Time>
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
      </FilteredPage>
    </div>
  );
};

Forecasts.getLayout = layout;

export default Forecasts;
