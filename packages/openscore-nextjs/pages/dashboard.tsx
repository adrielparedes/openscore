import { layout } from "../components/layout/MainLayout";
import { NextPageWithLayout } from "./_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div className="animated fadeIn">
      <h1>Dashboard</h1>

      <div className="row">
        <div className="col-sm-6 col-lg-3"></div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-info">
            <div className="card-body pb-0">
              <h4 className="mb-0"> </h4>
              <p>Matches today</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-danger">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Days until Final match</p>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-info">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Argentineans/SolaEast registered</p>
              <ol></ol>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-warning">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Brazilians registered</p>
              <ol></ol>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-success">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Mexicans registered</p>
              <ol></ol>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-warning">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Colombians/CEACA registered</p>
              <ol></ol>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-danger">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Chileans registered</p>
              <ol></ol>
            </div>
          </div>
        </div>

        <div className="col-sm-6 col-lg-3">
          <div className="card text-white bg-danger">
            <div className="card-body pb-0">
              <h4 className="mb-0"></h4>
              <p>Peruvians registered</p>
              <ol></ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = layout;

export default Dashboard;
