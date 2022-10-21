import { atom, selector } from "recoil";
import { Partido } from "../model/Partido";

export enum ForecastFilter {
  ALL,
  TODAY,
  REMAINING,
  GROUP_A,
  GROUP_B,
  GROUP_C,
  GROUP_D,
  GROUP_E,
  GROUP_F,
  GROUP_G,
  GROUP_H,
}

export const forecastListState = atom({
  key: "ForecastList",
  default: <Partido[]>[],
});

export const forecastFilterState = atom({
  key: "FilterForecastList",
  default: ForecastFilter.ALL,
});

export const filteredForecastState = selector({
  key: "FilteredForecastList",
  get: ({ get }) => {
    const forecastList = get(forecastListState);
    const filter = get(forecastFilterState);

    switch (filter) {
      case ForecastFilter.TODAY:
        return forecastList.filter(
          (partido) =>
            new Date(partido.dia).getDate() === new Date().getDate() &&
            new Date(partido.dia).getMonth() === new Date().getMonth()
        );
      case ForecastFilter.REMAINING:
        return forecastList.filter((partido) => {
          return partido.pronostico === undefined;
        });
      case ForecastFilter.GROUP_A:
        return filterByGroup(forecastList, "A");
      case ForecastFilter.GROUP_B:
        return filterByGroup(forecastList, "B");
      case ForecastFilter.GROUP_C:
        return filterByGroup(forecastList, "C");
      case ForecastFilter.GROUP_D:
        return filterByGroup(forecastList, "D");
      case ForecastFilter.GROUP_E:
        return filterByGroup(forecastList, "E");
      case ForecastFilter.GROUP_F:
        return filterByGroup(forecastList, "F");
      case ForecastFilter.GROUP_G:
        return filterByGroup(forecastList, "G");
      case ForecastFilter.GROUP_H:
        return filterByGroup(forecastList, "H");
      default:
        return forecastList;
    }
  },
});

const filterByGroup = (list: Partido[], grupo: string) =>
  list.filter(
    (partido) => partido.grupo.nombre === `Group ${grupo.toUpperCase()}`
  );
