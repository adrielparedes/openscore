import { layout } from "../../../components/templates/MainLayout";
import { NextPageWithLayout } from "../../_app";

const Matches: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Matches</h1>
    </div>
  );
};

Matches.getLayout = layout;

export default Matches;
