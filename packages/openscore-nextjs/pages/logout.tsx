import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import LoadingScreen from "../components/molecules/LoadingScreen";
import messi from "../images/messi.webp";
import rest from "../services/Rest";
import {
  isLoggerInState,
  tokenState,
  TOKEN_KEY,
} from "../states/SecurityState";

const Login: NextPage = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [token, setToken] = useRecoilState(tokenState);
  const isLoggedIn = useRecoilValue(isLoggerInState);

  useEffect(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    rest.defaults.headers.common["Authorization"] = ``;
  }, []);

  return (
    <LoadingScreen busy={busy}>
      <div className="login">
        <div className="login__left">
          <div className="login__header">
            <img src="/logo-black.png" alt="openscore-logo"></img>
          </div>
          <div className="login__form">
            <h3>You have been logged out, thanks for playing!</h3>
            <Link href={"/login"}>
              <a>Login again</a>
            </Link>
          </div>
        </div>
        <div className="login__right">
          <Image src={messi} layout="fill" objectFit="cover"></Image>
        </div>
      </div>
    </LoadingScreen>
  );
};

export default Login;
