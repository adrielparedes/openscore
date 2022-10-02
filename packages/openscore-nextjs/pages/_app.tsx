import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
import { RecoilRoot, useSetRecoilState } from "recoil";
import { tokenState, TOKEN_KEY } from "../states/SecurityState";
import "../styles/main.scss";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const SecurityContext = () => {
  const setToken = useSetRecoilState(tokenState);
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setToken(token || "");
  });
  return <></>;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <RecoilRoot>
      <SecurityContext></SecurityContext>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}
