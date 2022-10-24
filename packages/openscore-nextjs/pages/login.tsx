import { Formik } from "formik";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import LoadingScreen from "../components/molecules/LoadingScreen";
import messi from "../images/messi.webp";
import { UsuarioService } from "../services/UsuarioService";
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
    setBusy(true);
    if (isLoggedIn) {
      router.push("/");
    } else {
      setBusy(false);
    }
  });

  return (
    <LoadingScreen busy={busy}>
      <div className="login">
        <div className="login__left">
          <div className="login__header">
            <img src="/logo-black.png" alt="openscore-logo"></img>
          </div>
          <div className="login__form">
            <h3>Welcome to OpenScore!</h3>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  // errors.email = "Required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  // errors.email = "Invalid email address";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);

                new UsuarioService()
                  .login(values)
                  .then((res) => {
                    const token = res.data.data.token;
                    setToken(token);
                    localStorage.setItem(TOKEN_KEY, token);
                    router.push("/");
                    setSubmitting(false);
                  })
                  .catch((err) => {
                    alert(err);
                    setSubmitting(false);
                  });
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-2">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="form-control"
                    />
                    {errors.email && touched.email && errors.email}
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className="form-control"
                    />
                    {errors.password && touched.password && errors.password}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Log In
                  </button>
                </form>
              )}
            </Formik>
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
