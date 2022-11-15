import { layout } from "../../../components/templates/MainLayout";
import { NextPageWithLayout } from "../../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div className="dashboard">
      <button className="btn btn-primary">Refresh</button>
      <div className="dashboard__people__container">
        <div className="card shadow">
          <div className="card-body dashboard__people__title">
            <div className="dashboard__people__title">Registrados</div>
            <div className="dashboard__people__number">51</div>
          </div>
        </div>
      </div>
      <div className="dashboard__people__container">
        <div className="card shadow">
          <div className="card-body dashboard__people__title">
            <div className="dashboard__people__title">Argentina</div>
            <div className="dashboard__people__number">51</div>
          </div>
        </div>
        <div className="card shadow">
          <div className="card-body">
            <div className="dashboard__people__title">Brazil</div>
            <div className="dashboard__people__number">26</div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = layout;

export default Dashboard;
