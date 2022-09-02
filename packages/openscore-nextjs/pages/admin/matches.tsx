import type { NextPage } from "next";
import { layout } from "../../components/layout/MainLayout";
import { NextPageWithLayout } from "../_app";

const Matches: NextPageWithLayout = () => {
  return (
    <div>
      <h1 className="display-1">Matches</h1>
    </div>
  );
};

Matches.getLayout = layout;

export default Matches;
