import { useEffect, useState } from "react";

export interface CountdownProps {
  date: number;
}

const Countdown = ({ date }: CountdownProps) => {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  var difference_ms = Math.abs(date - time);

  difference_ms = difference_ms / 1000;
  const seconds = Math.floor(difference_ms % 60);
  difference_ms = difference_ms / 60;
  const minutes = Math.floor(difference_ms % 60);
  difference_ms = difference_ms / 60;
  const hours = Math.floor(difference_ms % 24);
  const days = Math.floor(difference_ms / 24);

  if (date - time > 0) {
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
