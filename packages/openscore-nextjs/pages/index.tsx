import { useRecoilValue } from "recoil";
import EmptyScreen from "../components/molecules/EmptyScreen";
import { layout } from "../components/templates/MainLayout";
import { userState } from "../states/SecurityState";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  const user = useRecoilValue(userState);

  return (
    <div>
      <h1>Welcome {user?.nombre}!</h1>
      <EmptyScreen isEmpty={true}></EmptyScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
