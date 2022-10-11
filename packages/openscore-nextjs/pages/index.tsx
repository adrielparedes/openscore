import EmptyScreen from "../components/molecules/EmptyScreen";
import { layout } from "../components/templates/MainLayout";
import { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Home</h1>
      <EmptyScreen isEmpty={true}></EmptyScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
