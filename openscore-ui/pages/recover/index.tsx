import { Formik } from "formik";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import LoadingScreen from "../../components/molecules/LoadingScreen";
import messi from "../../images/img-pelota.png";
import { UsuarioService } from "../../services/UsuarioService";
import {
  isLoggerInState,
  tokenState,
  TOKEN_KEY,
} from "../../states/SecurityState";

const Recover: NextPage = () => {
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
  }, [token]);

  return (
    <LoadingScreen busy={busy}>
      <div className="login">
        <div className="login__left">
          <div className="login__header">
            <img src="/rhopenscore2022-logo.png" alt="openscore-logo"></img>
          </div>
          <div className="login__form">
            <h3>Recover password</h3>
            <Formik
              initialValues={{ email: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  // errors.email = "Required";
                } else if (!/^[A-Z0-9._%+-]+@redhat.com$/i.test(values.email)) {
                  // errors.email = "Invalid email address";
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                setSubmitting(true);
                new UsuarioService()
                  .sendRecoverEmail(values.email)
                  .then((res) => {
                    setToken("");
                    localStorage.removeItem(TOKEN_KEY);
                    router.push("/login");
                    toast.info("Mail Sent, please check your inbox");
                    setSubmitting(false);
                  })
                  .catch((err) => {
                    setFieldError(
                      "email",
                      err.response?.data?.description ||
                        "Error trying to recover password"
                    );
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
                    <span className="login__error">
                      {errors.email && touched.email && errors.email}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Send Recover Password Email
                  </button>
                  <hr />
                  <p className="text-center">
                    You already have an account?{" "}
                    <Link href={"/login"}>
                      <a>Login</a>
                    </Link>
                  </p>
                  <p className="text-center">
                    Not registered yet?{" "}
                    <Link href={"/register"}>
                      <a>Register</a>
                    </Link>
                  </p>
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

export default Recover;
