import type { NextPage } from "next";
import { layout } from "../components/templates/MainLayout";
import { NextPageWithLayout } from "./_app";

const Rules: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Rules</h1>
      <div className="reglas">
        <ul className="reglas__content">
          <li>
            To participate it is <b>necessary to be registered</b>.
          </li>
          <li>
            Only Red Hat associates from <b>Argentina/SolaEast</b>, <b>Brazil</b>, <b>Chile</b>, <b>Peru</b>, <b>Colombia/CEACA</b> and <b>Mexico</b> can participate, using the corporate e-mail address.
          </li>
          <li>
            Participants may register any time during World Cup 2022 and until the
            day before the final match. Points will be awarded only for the
            matches for which predictions were entered, and, in consequence: 0
            (ZERO) points will be awarded for matches with no predictions
            entered.
          </li>
          <li>
            World Cup 2022 consists of <b>64 matches</b>, of which: 48 are in the
            initial group stage, 8 in round of 16, 4 in quarter-finals, 2 in semi-finals, 1 for
            3rd place and 1 final match.
          </li>
          <li>
            Participants may enter predictions
            <b>until 15 minutes</b> before the matches start.
          </li>
          <li>
            For the predictions on quarter finals until the final match, the 90
            minutes of the match plus the additional time, if any, and penalties
            will be taken into account.
          </li>
          <li>
            Scoring for each match in the group stage will be of <b>1 (ONE)</b> point per correct prediction (Local, Tie, Visitor).
          </li>
          <li>
            Scoring for each match in quarter-finals will be <b>2 (TWO)</b> points per correct prediction (Local, Tie, Visitor).
          </li>
          <li>
            Scoring for each match in semi-finals will be of <b>3 (THREE)</b> points per correct predicition (Local, Tie,
            Visitor).
          </li>
          <li>
            Scoring for the 3rd place match and the Final will be of
            <b>4 (FOUR)</b> points per correct prediction (Local, Tie, Visitor).
          </li>
          <li>
            There will be <b>three winners in each sub-region</b> (the top
            three): 3 (THREE) winners in Argentina/SolaEast, 3 (THREE) winners
            in Brazil, 3 (THREE) winners in Chile, 3 (THREE) winners in Peru, 3
            (THREE) winners in Colombia/CEACA and 3 (THREE) winners in Mexico.
          </li>
          <li>
            In the case of a tie a <b>random drawing</b> will take place to
            determine the winners.
          </li>
        </ul>
      </div>
    </div>
  );
};

Rules.getLayout = layout;

export default Rules;
