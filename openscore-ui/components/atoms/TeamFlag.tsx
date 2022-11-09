import Flag from "react-world-flags";

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
        <Flag code={src} fallback={<span>{src}</span>} />
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
