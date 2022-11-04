import { atom } from "recoil";
import { Pais } from "../model/Pais";

export const countriesState = atom({
  key: "Countries",
  default: <Pais[]>[],
});
