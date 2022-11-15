import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useRecoilValue } from "recoil";
import WorldCupCountdown from "../components/atoms/WorldCupCountdown";
import EmptyScreen from "../components/molecules/EmptyScreen";
import Leaderboard from "../components/molecules/Leaderboard";
import LoadingScreen from "../components/molecules/LoadingScreen";
import { layout } from "../components/templates/MainLayout";
import { userState } from "../states/SecurityState";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const user = useRecoilValue(userState);
  const [twitter, setTwitter] = useState(true);

  return (
    <div className="home">
      <h1>Welcome {user?.nombre}!</h1>
      <EmptyScreen isEmpty={false}>
        <WorldCupCountdown></WorldCupCountdown>

        <div className="home__information">
          <div className="home__information__left">
            <div className="card card-dark">
              <div className="card-body home__information__card">
                <span>
                  Red Hat Open Score is a cloud based application made with{" "}
                  <i className="bi bi-heart-fill" /> by Red Hatters for Red
                  Hatters!
                </span>
              </div>
            </div>
            <div className="card">
              <div className="card-body home__information__card">
                <span>
                  Join our Google Workspaces Space!{" "}
                  <a
                    href="https://chat.google.com/room/AAAAo0bThwQ?cls=7"
                    target="_blank"
                    rel="noreferrer"
                  >
                    #Red Hat Openscore Community
                  </a>
                </span>
              </div>
            </div>
          </div>
          <div className="card shadow">
            <div className="card-body">
              <div className="h3">How to play?</div>
              <p>
                Welcome to the play zone! In the{" "}
                <Link href={"/forecast"}>
                  <a>Forecast</a>
                </Link>{" "}
                you'll see the games that are played on the day. If you want to
                set predictions for future games, choose "remaining" (or go by
                groups) Once you see the boxes for each match, you just need to
                select the option for that specific match. Click on "Home" if
                you think that the team on the left wins, "Away" for the team on
                the right or "Draw" if you think it will end on a tie. If you
                want to check your selections, go to "All" or by groups.
                Selections can be changed up to 15 min before each match.
              </p>
              <p className="small text-muted">
                *<strong>Home</strong> references the team that leads the match.
              </p>
            </div>
          </div>
        </div>
        <div className="home__content">
          <div className="card shadow">
            <TwitterTimelineEmbed
              sourceType="profile"
              screenName="FIFAWorldCup"
              autoHeight={true}
              noHeader={true}
              noFooter={true}
              transparent={true}
              noBorders={true}
              tweetLimit={10}
              placeholder={<LoadingScreen busy={twitter}></LoadingScreen>}
              onLoad={(props) => {
                setTwitter(true);
              }}
            />
          </div>
          <div className="home__leaderboard card shadow">
            <div className="card-body home__leaderboard__body">
              <div className="h3">General Leaderboard</div>
              <Leaderboard filter="general" query="" results={10}></Leaderboard>
            </div>
            <div className="card-footer text-end">
              <Link href="/leaderboard">
                <a>
                  Leaderboard <i className="bi bi-arrow-right"></i>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </EmptyScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
