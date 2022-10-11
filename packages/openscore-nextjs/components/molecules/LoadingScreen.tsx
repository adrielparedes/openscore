import { PropsWithChildren, ReactNode } from "react";

export interface LoadingScreenProps extends PropsWithChildren {
  busy: boolean;
}

const LoadingScreen = ({ busy, children }: LoadingScreenProps): JSX.Element => {
  if (busy) {
    return (
      <div className="loading-screen">
        <div className="d-flex justify-content-center">
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  } else {
    return <>{children}</>;
  }
};

export default LoadingScreen;
