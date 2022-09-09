import type { NextPage } from "next";
import { layout } from "../components/layout/MainLayout";
import { NextPageWithLayout } from "./_app";

const leaderboard = [
  {
    name: "Adriel Paredes",
    score: 71,
    country: "Argentina",
    position: 1,
  },
  {
    name: "Leandro Beretta",
    score: 70,
    country: "Brasil",
    position: 2,
  },
  {
    name: "Emilia Paredes",
    score: 69,
    country: "Peru",
    position: 3,
  },
];

const Leaderboard: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Leaderboard</h1>

      <div className="top__three mb-4">
        <h5>Top 3</h5>
        <div className="leaderboard">
          {leaderboard.map((l) => (
            <div key={l.name} className="card border-light leaderboard__line">
              <div className="card-body ">
                <div className="leaderboard__left">
                  <div className="leaderboard__name">{l.name}</div>
                  <div className="leaderboard__score">
                    Score: {l.score} points
                  </div>
                </div>
                <div className="leaderboard__country">{l.country}</div>
                <div
                  className={`leaderboard__position leaderboard__position--${l.position}`}
                >
                  <span>{l.position}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="others">
        <h5>Others</h5>
        <div className="leaderboard">
          {leaderboard.map((l) => (
            <div key={l.name} className="card border-light leaderboard__line">
              <div className="card-body ">
                <div className="leaderboard__left">
                  <div className="leaderboard__name">{l.name}</div>
                  <div className="leaderboard__score">
                    Score: {l.score} points
                  </div>
                </div>
                <div className="leaderboard__country">{l.country}</div>
                <div className="leaderboard__position">{l.position}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Leaderboard.getLayout = layout;

export default Leaderboard;
