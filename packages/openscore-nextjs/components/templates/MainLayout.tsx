import { PropsWithChildren, ReactElement } from "react";
import Navbar from "../molecules/Navbar";

const MainTemplate = ({ children }: PropsWithChildren) => (
  <div>
    <Navbar></Navbar>
    <div className="container">{children}</div>
  </div>
);

export const layout = (page: ReactElement) => (
  <MainTemplate>{page}</MainTemplate>
);

export default MainTemplate;
