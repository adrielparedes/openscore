import { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot, useRecoilState } from "recoil";
import rest from "../services/Rest";
import { tokenState, TOKEN_KEY } from "../states/SecurityState";
import "../styles/main.scss";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const SecurityContext = () => {
  const router = useRouter();
  const [token, setToken] = useRecoilState(tokenState);
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    setToken(token || "");
    rest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (!token) {
      router.push("/login");
    }
  }, []);
  return <></>;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require("bootstrap-icons/font/bootstrap-icons.css");
  }, []);
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <RecoilRoot>
      {getLayout(
        <>
          <SecurityContext></SecurityContext>
          <Component {...pageProps} />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      )}
    </RecoilRoot>
  );
}
