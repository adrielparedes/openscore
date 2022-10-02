import { atom } from "recoil";
import { Partido } from "../model/Partido";

export const forecastListState = atom({
  key: "ForecastList",
  default: <Partido[]>[],
});
