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
      <Head>
        <title>Red Hat Openscore - World Cup 2022</title>
        <meta
          property="og:title"
          content="Red Hat Openscore - World Cup 2022"
        />
        <meta
          property="og:site_name"
          content="Red Hat Openscore - World Cup 2022"
        />
        <meta
          property="og:description"
          content="Play with your friends in this new edition of Red Hat Openscore"
        />
        <meta
          property="og:image"
          itemProp="image"
          content="https://www.rhopenscore.com/rhopenscore2022-logo.png"
        />
        <meta property="og:type" content="website" />
      </Head>
      <h1>Welcome {user?.nombre}!</h1>
      <EmptyScreen isEmpty={false}>
        <WorldCupCountdown></WorldCupCountdown>
        <div className="card mb-3">
          <div className="card-body">
            Join our Google Workspaces Space!{" "}
            <a
              href="https://chat.google.com/room/AAAAo0bThwQ?cls=7"
              target="_blank"
              rel="noreferrer"
            >
              #Red Hat Openscore Community
            </a>
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
