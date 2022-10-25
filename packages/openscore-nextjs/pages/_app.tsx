import { NextPage } from "next";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import {
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RecoilRoot, useRecoilState } from "recoil";
import LoadingScreen from "../components/molecules/LoadingScreen";
import rest from "../services/Rest";
import { tokenState, TOKEN_KEY } from "../states/SecurityState";
import "../styles/main.scss";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const SecurityContext = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [token, setToken] = useRecoilState(tokenState);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (router.asPath === "/logout") {
      return;
    }

    setBusy(true);
    if (token.length === 0) {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t !== null && t.length > 1) {
        setToken(t);
        rest.defaults.headers.common["Authorization"] = `Bearer ${t}`;
        setBusy(false);
      } else {
        router.push("/login").then((value) => {
          setBusy(false);
        });
      }
    } else {
      rest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setBusy(false);
    }
  }, [token]);

  return <LoadingScreen busy={busy}>{children}</LoadingScreen>;
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
      <SecurityContext>
        {getLayout(<Component {...pageProps} />)}
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
      </SecurityContext>
    </RecoilRoot>
  );
}
