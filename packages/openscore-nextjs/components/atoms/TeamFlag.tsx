const TeamFlag = ({ src }: { src: string | undefined }) => {
  if (src) {
    return (
      <div className="match__flag shadow">
        <img src={`https://countryflagsapi.com/png/${src}`}></img>
      </div>
    );
  } else {
    return (
      <div className="match__flag shadow">
        <div>NF</div>
      </div>
    );
  }
};

export default TeamFlag;
