import Link from "next/link";
import { useEffect } from "react";
import { layout } from "../components/layout/MainLayout";
import MatchCard from "../components/MatchCard";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  useEffect(() => {
    const s = document.createElement("script");
    s.setAttribute("src", "https://platform.twitter.com/widgets.js");
    s.setAttribute("async", "true");
    document.head.appendChild(s);
  }, []);
  return (
    <div>
      <h1 className="display-1">Home</h1>
      <section>
        <h2 className="display-2">Upcoming Matches</h2>
        <div>
          <MatchCard></MatchCard>
        </div>
        <Link href="/forecast">
          <button className="btn btn-primary">Go to Forecast</button>
        </Link>
      </section>
      <section>
        <h2>FIFA World Cup Qatar 2022 Timeline</h2>
        <a
          className="twitter-timeline"
          href="https://twitter.com/FIFAWorldCup?ref_src=twsrc%5Etfw"
        >
          Tweets by FIFAWorldCup
        </a>{" "}
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        ></script>
      </section>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
