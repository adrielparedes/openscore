const TeamFlag = ({ src }: { src: string }) => (
  <div className="match__flag">
    <img src={`https://countryflagsapi.com/svg/${src}`}></img>
  </div>
);

const MatchCard = () => (
  <div>
    <div className="match card border-light text-center shadow">
      <div className="card-body">
        <h5 className="card-title">FIFA World Cup - Qatar 2022</h5>
        <h6 className="card-subtitle muted mb-3">Round Robin 1 of 3</h6>
        <div className="match__results">
          <TeamFlag src="arg"></TeamFlag>
          <div className="match__score">3 : 1</div>
          <TeamFlag src="bra"></TeamFlag>
          <div className="match__team">Argentina</div>
          <div className="match__status">36'</div>
          <div className="match__team">Brasil</div>
        </div>
        <ul className="match__selection nav nav-pills">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">
              Home
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#">
              Draw
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" aria-current="page" href="#">
              Away
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

export default MatchCard;
