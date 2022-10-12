import type { NextPage } from "next";
import { layout } from "../components/templates/MainLayout";
import { NextPageWithLayout } from "./_app";

const Rules: NextPageWithLayout = () => {
  return (
    <div>
      <h1>Rules</h1>
      <div className="reglas">
        <div className="card mb-1">
          <div className="card-body">
            <b>1.</b> To participate it is <b>necessary to be registered</b>.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>2.</b> Only Red Hat associates from <b>Argentina/SolaEast</b>,
            <b>Brazil</b>, <b>Chile</b>, <b>Peru</b>, <b>Colombia/CEACA</b> and
            <b>Mexico</b> can participate, using the corporate e-mail address.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>3.</b> Participants may register any time during Copa América and
            until the day before the final match. Points will be awarded only
            for the matches for which predictions were entered, and, in
            consequence: 0 (ZERO) points will be awarded for matches with no
            predictions entered.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>4.</b> Copa América consists of <b>28 matches</b>, of which: 20
            are in the initial group stage, 4 in quarter-finals, 2 in
            semi-finals, 1 for 3rd place and 1 final match.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>5.</b> Participants may enter predictions
            <b>until 15 minutes</b> before the matches start.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>6.</b> For the predictions on quarter finals until the final
            match, the 90 minutes of the match plus the additional time, if any,
            and penalties will be taken into account.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>7.</b> Scoring for each match in the group stage will be of
            <b>1 (ONE)</b> point per correct prediction (Local, Tie, Visitor).
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>8.</b> Scoring for each match in quarter-finals will be
            <b>2 (TWO)</b> points per correct prediction (Local, Tie, Visitor).
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>9.</b> Scoring for each match in semi-finals will be of
            <b>3 (THREE)</b> points per correct predicition (Local, Tie,
            Visitor).
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>11.</b> Scoring for the 3rd place match and the Final will be of
            <b>4 (FOUR)</b> points per correct prediction (Local, Tie, Visitor).
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>12.</b> There will be <b>three winners in each sub-region</b>{" "}
            (the top three): 3 (THREE) winners in Argentina/SolaEast, 3 (THREE)
            winners in Brazil, 3 (THREE) winners in Chile, 3 (THREE) winners in
            Peru, 3 (THREE) winners in Colombia/CEACA and 3 (THREE) winners in
            Mexico.
          </div>
        </div>
        <div className="card mb-1">
          <div className="card-body">
            <b>13.</b> In the case of a tie a <b>random drawing</b> will take
            place to determine the winners.
          </div>
        </div>
      </div>
    </div>
  );
};

Rules.getLayout = layout;

export default Rules;
