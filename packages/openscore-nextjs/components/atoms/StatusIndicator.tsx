import { PropsWithChildren, ReactNode } from "react";

const getCss = (status: ReactNode) => {
  switch (status) {
    case "BLOCKER":
      return "text-bg-primary";
    case "FINISHED":
      return "text-bg-info";
    case "PENDING":
      return "text-bg-warning";
    default:
      return "text-bg-primary";
  }
};

const StatusIndicator = ({ children }: PropsWithChildren) => (
  <div className={`match__status badge rounded-pill ${getCss(children)}`}>
    {children}
  </div>
);

export default StatusIndicator;
