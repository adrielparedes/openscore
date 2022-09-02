import { PropsWithChildren } from "react";

const MatchCard = () => (
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">FIFA World Cup Qatar 2022</h5>
      <h6 className="card-subtitle mb-2 text-muted">First Phase - Group D</h6>
      <div className="card-teams">
        <div className="card-home">
          <div className="card-logo"></div>
          <div className="card-team-name">Argentina</div>
        </div>
        <div className="card-status">0-0</div>
        <div className="card-away">
          <div className="card-logo"></div>
          <div className="card-team-name">Brasil</div>
        </div>
      </div>
    </div>
  </div>
);

export default MatchCard;
