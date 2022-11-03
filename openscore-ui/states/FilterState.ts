import { atom } from "recoil";
import { Filter, NONE } from "../components/molecules/FilteredPage";

export const leaderboardState = atom({
  key: "Leaderboard",
  default: NONE,
});
