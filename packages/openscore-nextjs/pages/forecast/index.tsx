import { layout } from "../../components/layout/MainLayout";
import { NextPageWithLayout } from "../_app";

const Forecasts: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Forecast</h1>
    </div>
  );
};

Forecasts.getLayout = layout;

export default Forecasts;
