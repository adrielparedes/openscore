import { useRecoilValue } from "recoil";
import TeamFlag from "../../components/atoms/TeamFlag";
import EmptyScreen from "../../components/molecules/EmptyScreen";
import { layout } from "../../components/templates/MainLayout";
import { userState } from "../../states/SecurityState";
import { NextPageWithLayout } from "../_app";

const Home: NextPageWithLayout = () => {
  const user = useRecoilValue(userState);

  return (
    <div>
      <h1>Standings</h1>
      <EmptyScreen isEmpty={false}>
        <div className="standings">
          <div className="card shadow">
            <div className="card-header">Group A</div>
            <div className="card-body">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Team</th>
                    <th>P</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>G</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="standings__position">1</div>
                    </td>
                    <td className="standings__team">
                      <TeamFlag src="ARG"></TeamFlag> <span>Argentina</span>
                    </td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="standings__position">2</div>
                    </td>
                    <td className="standings__team">
                      <TeamFlag src="BRA"></TeamFlag> <span>Brasil</span>
                    </td>
                    <td>4</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="standings__position">3</div>
                    </td>
                    <td className="standings__team">
                      <TeamFlag src="URY"></TeamFlag> <span>Uruguay</span>
                    </td>
                    <td>6</td>
                  </tr>
                  <tr>
                    <td>
                      <div className="standings__position">4</div>
                    </td>
                    <td className="standings__team">
                      <TeamFlag src="USA"></TeamFlag> <span>USA</span>
                    </td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </EmptyScreen>
    </div>
  );
};

Home.getLayout = layout;

export default Home;
