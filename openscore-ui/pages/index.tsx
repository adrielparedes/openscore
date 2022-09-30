import Link from "next/link";
import { useState } from "react";
import { TwitterTimelineEmbed } from "react-twitter-embed";
import { useRecoilValue } from "recoil";
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
            <div className="card-body">
              <div className="h3">General Leaderboard</div>
              <Leaderboard filter="" query="" results={10}></Leaderboard>
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
