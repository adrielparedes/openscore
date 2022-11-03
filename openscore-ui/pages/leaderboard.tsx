import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import FilteredPage, { Filter } from "../components/molecules/FilteredPage";
import Leaderboard from "../components/molecules/Leaderboard";
import { layout } from "../components/templates/MainLayout";
import { PaisesService } from "../services/PaisesService";
import { leaderboardState } from "../states/FilterState";
import { NextPageWithLayout } from "./_app";

const LeaderboardPage: NextPageWithLayout = () => {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [selected, setSelected] = useRecoilState(leaderboardState);

  const [query, setQuery] = useState("");
  const paisesService = new PaisesService();

  useEffect(() => {
    paisesService.getAll(0, 10).then((res) => {
      const f: Filter[] = res.data.data.map((p) => {
        return {
          code: p.codigo,
          name: p.nombre,
        };
      });
      setFilters(f);
    });
  }, []);

  return (
    <div>
      <h1>Leaderboard</h1>

      <FilteredPage
        link="/leaderboard"
        def={{ code: "general", name: "General" }}
        filters={filters}
        select={setSelected}
      >
        <h3 className="mb-3">{selected?.name || "General"} Leaderboard</h3>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            aria-describedby="basic-addon1"
            onChange={(content) => {
              setQuery(content.target.value);
            }}
          ></input>
        </div>
        <Leaderboard filter={selected.code} query={query}></Leaderboard>
      </FilteredPage>
    </div>
  );
};

LeaderboardPage.getLayout = layout;

export default LeaderboardPage;
