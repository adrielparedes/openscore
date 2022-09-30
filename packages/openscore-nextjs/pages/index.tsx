import EmptyScreen from "../components/EmptyScreen";
import { layout } from "../components/layout/MainLayout";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Home</h1>
      <EmptyScreen></EmptyScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
