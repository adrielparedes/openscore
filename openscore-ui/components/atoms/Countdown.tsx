import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { timeState } from "../../states/TimeState";

export interface CountdownProps {
  date: number;
  blocked: (blocked: boolean) => void;
}

const Countdown = ({ date, blocked }: CountdownProps) => {
  const [time, setTime] = useState(Date.now());
  const timeToMatch = useRecoilValue(timeState);

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  var time_to_match_ms = date - time;
  var time_to_block_ms = date - time - 15 * 60 * 1000;

  if (timeToMatch) {
    difference_ms = time_to_block_ms;
  } else {
    var difference_ms = time_to_match_ms;
  }

  difference_ms = Math.abs(difference_ms / 1000);
  const seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms / 60;
  const minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms / 60;
  const hours = Math.floor(difference_ms % 24);
  const days = Math.floor(difference_ms / 24);

  if (time_to_block_ms < 0) {
    blocked(true);
  } else {
    blocked(false);
  }

  if (
    (!timeToMatch && time_to_match_ms > 0) ||
    (timeToMatch && time_to_block_ms > 0)
  ) {
    return (
      <div className="countdown">
        <div className="countdown__item countdown__item--active">
          <div>{days}</div>
          <div>Days</div>
        </div>
        <div>:</div>
        <div className="countdown__item">
          <div>{hours}</div>
          <div>Hours</div>
        </div>
        <div>:</div>
        <div className="countdown__item">
          <div>{minutes}</div>
          <div>Minutes</div>
        </div>
        <div>:</div>
        <div className="countdown__item">
          <div>{seconds}</div>
          <div>Seconds</div>
        </div>
      </div>
    );
  } else {
    return <div className="countdown">Good Luck!</div>;
  }
};

export default Countdown;
