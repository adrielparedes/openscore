const TeamFlag = ({
  src,
  className,
}: {
  src: string | undefined;
  className?: string;
}) => {
  if (src) {
    return (
      <div className={`match__flag shadow ${className}`}>
        <img src={`https://countryflagsapi.com/png/${src}`}></img>
      </div>
    );
  } else {
    return (
      <div className={`match__flag shadow ${className}`}>
        <div>NF</div>
      </div>
    );
  }
};

export default TeamFlag;
