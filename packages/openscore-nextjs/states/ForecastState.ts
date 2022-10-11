import { atom, selector } from "recoil";
import { Partido } from "../model/Partido";

export enum ForecastFilter {
  ALL,
  TODAY,
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

    console.log(filter);
    switch (filter) {
      case ForecastFilter.TODAY:
        forecastList.filter(
          (partido) => new Date(partido.dia).getDate() === new Date().getDate()
        );
      default:
        forecastList;
    }
  },
});
