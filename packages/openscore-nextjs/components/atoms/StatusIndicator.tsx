import { PropsWithChildren } from "react";

const StatusIndicator = ({ children }: PropsWithChildren) => (
  <div
    className={`match__status badge rounded-pill ${
      children === "BLOCKED" ? "text-bg-primary" : "text-bg-info"
    }`}
  >
    {children}
  </div>
);

export default StatusIndicator;
