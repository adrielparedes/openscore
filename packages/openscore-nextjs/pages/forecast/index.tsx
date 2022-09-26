import Link from "next/link";
import { useRouter } from "next/router";
import { layout } from "../../components/layout/MainLayout";
import LoadingScreen from "../../components/LoadingScreen";
import MatchCard from "../../components/MatchCard";
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

const getLink = (link: string) => `/forecast?filter=${link}`;

const Forecasts: NextPageWithLayout = () => {
  const router = useRouter();
  const { filter } = router.query;
  const path = router.asPath;

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
          <div className="forecast__matches">
            <MatchCard></MatchCard>
            <MatchCard></MatchCard>
            <MatchCard></MatchCard>
            <MatchCard></MatchCard>
            <MatchCard></MatchCard>
          </div>
        </LoadingScreen>
      </div>
    </div>
  );
};

Forecasts.getLayout = layout;

export default Forecasts;
