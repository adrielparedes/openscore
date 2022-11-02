import { useRecoilState } from "recoil";
import { timeState } from "../../states/TimeState";

const Time = () => {
  const [time, setTime] = useRecoilState(timeState);
  console.log(time);
  return (
    <div className="form-check form-switch">
      <label className="form-check-label">Time to Match</label>
      <input
        className="form-check-input"
        type="checkbox"
        role="switch"
        checked={time}
        id="flexSwitchCheckDefault"
        onChange={(c) => setTime((t) => !t)}
      />
      <label className="form-check-label">Time to Block</label>
    </div>
  );
};

export default Time;
