import "@fontsource/open-sans";
import "@fontsource/quicksand";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
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
import { RecoilRoot, useRecoilState, useSetRecoilState } from "recoil";
import LoadingScreen from "../components/molecules/LoadingScreen";
import { PaisesService } from "../services/PaisesService";
import rest from "../services/Rest";
import { countriesState } from "../states/PaisesState";
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

    if (router.asPath.includes("recover")) {
      return;
    }

    if (router.asPath === "/register") {
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

const Initialize = () => {
  const setCountries = useSetRecoilState(countriesState);
  useEffect(() => {
    new PaisesService()
      .getAll(0, 10)
      .then((res) => setCountries(res.data.data));
  });
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
      <Head>
        <title>Red Hat Openscore - World Cup 2022</title>
        <meta
          name="description"
          content="Play with your friends in this new edition of Red Hat Openscore"
        />

        <meta property="og:url" content="https://www.rhopenscore.com/" />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Red Hat Openscore - World Cup 2022"
        />
        <meta
          property="og:description"
          content="Play with your friends in this new edition of Red Hat Openscore"
        />
        <meta
          property="og:image"
          content="https://www.rhopenscore.com/rhopenscore2022-logo.png"
        />
        <meta
          property="og:secure_url"
          content="https://www.rhopenscore.com/rhopenscore2022-logo.png"
        />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="rhopenscore.com" />
        <meta property="twitter:url" content="https://www.rhopenscore.com/" />
        <meta
          name="twitter:title"
          content="Red Hat Openscore - World Cup 2022"
        />
        <meta
          name="twitter:description"
          content="Play with your friends in this new edition of Red Hat Openscore"
        />
        <meta
          name="twitter:image"
          content="https://www.rhopenscore.com/rhopenscore2022-logo.png"
        />
      </Head>
      <SecurityContext>
        <Initialize />
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
