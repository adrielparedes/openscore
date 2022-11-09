import TeamFlag from "../components/atoms/TeamFlag";
import { layout } from "../components/templates/MainLayout";
import { NextPageWithLayout } from "./_app";

const Test: NextPageWithLayout = () => {
  return (
    <>
      <h1>Test Page</h1>
      <div className="knockout">
        <div className="knockout__stage knockout__round-16 ">
          <div className="knockout__match card">
            <div className="card-body">
              <div className="knockout__team">
                <TeamFlag src="ARG"></TeamFlag>
                Argentina
              </div>
              <div className="knockout__team">
                <TeamFlag src="BRA"></TeamFlag>
                Brazil
              </div>
            </div>
          </div>
          <div className="knockout__match card">
            <div className="card-body">
              <div className="knockout__team">
                <TeamFlag src="ARG"></TeamFlag>
                Argentina
              </div>
              <div className="knockout__team">
                <TeamFlag src="BRA"></TeamFlag>
                Brazil
              </div>
            </div>
          </div>
          <div className="knockout__match card">
            <div className="card-body">
              <div className="knockout__team">
                <TeamFlag src="ARG"></TeamFlag>
                Argentina
              </div>
              <div className="knockout__team">
                <TeamFlag src="BRA"></TeamFlag>
                Brazil
              </div>
            </div>
          </div>
          <div className="knockout__match card">
            <div className="card-body">
              <div className="knockout__team">
                <TeamFlag src="ARG"></TeamFlag>
                Argentina
              </div>
              <div className="knockout__team">
                <TeamFlag src="BRA"></TeamFlag>
                Brazil
              </div>
            </div>
          </div>
        </div>
        <div className="knockout__quarter">
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
        </div>
        <div className="knockout__semi">
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
        </div>
        <div className="knockout__final">
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
          <div className="knockout__match">
            <div className="knockout__team"></div>
            <div className="knockout__team"></div>
          </div>
        </div>
      </div>
    </>
  );
};

Test.getLayout = layout;

export default Test;
