import { Field, Formik } from "formik";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilValue } from "recoil";
import LoadingScreen from "../../components/molecules/LoadingScreen";
import messi from "../../images/img-pelota.png";
import RecoverPassword from "../../model/RecoverPassword";
import { UsuarioService } from "../../services/UsuarioService";
import { isLoggerInState } from "../../states/SecurityState";

const Login: NextPage = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const isLoggedIn = useRecoilValue(isLoggerInState);
  const [recover, setRecover] = useState<RecoverPassword>();

  useEffect(() => {
    setBusy(true);
    if (isLoggedIn) {
      router.push("/");
      setBusy(false);
    } else {
      if (router.isReady) {
        const { token } = router.query;
        setRecover({
          confirmacionPassword: "",
          email: "",
          password: "",
          token: token as string,
        });
        setBusy(false);
      }
    }
  }, [router.isReady]);

  return (
    <LoadingScreen busy={busy}>
      <div className="login">
        <div className="login__left">
          <div className="login__header">
            <img src="/rhopenscore2022-logo.png" alt="openscore-logo"></img>
          </div>
          <div className="login__form">
            <h3>Update Password</h3>
            <Formik
              initialValues={
                recover || {
                  token: "",
                  email: "",
                  password: "",
                  confirmacionPassword: "",
                }
              }
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
                  .recoverPassword(values)
                  .then((res) => {
                    toast.success("Password change successfully");
                    router.push("/login");
                    setSubmitting(false);
                  })
                  .catch((err) => {
                    const errors = err.response.data.description.split("\n");
                    errors.map((e: string) => {
                      const fieldError = e.split(":");

                      var fieldName = fieldError[0];

                      const fieldDescription =
                        fieldError[1].trim().charAt(0).toUpperCase() +
                        fieldError[1].trim().slice(1);

                      if (fieldName.length === 0) {
                        if (fieldDescription.includes("confirmacionEmail")) {
                          fieldName = "confirmacionEmail";
                        }
                        if (fieldDescription.includes("confirmacionPassword")) {
                          fieldName = "confirmacionPassword";
                        }
                      }

                      setFieldError(fieldName, "* " + fieldDescription);
                    });

                    setSubmitting(false);
                  });
              }}
            >
              {({
                errors,
                touched,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-2">
                    <label htmlFor="email">Email</label>
                    <Field type="email" name="email" className="form-control" />
                    <span className="login__error">
                      {errors.email && touched.email && errors.email}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="email">Token</label>
                    <Field
                      type="string"
                      name="token"
                      className="form-control"
                      disabled
                    />
                    <span className="login__error">
                      {errors.email && touched.email && errors.email}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className="form-control"
                    />
                    <span className="login__error">
                      {errors.password && touched.password && errors.password}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="password">Password Confirmation</label>
                    <Field
                      type="password"
                      name="confirmacionPassword"
                      className="form-control"
                    />
                    <span className="login__error">
                      {errors.confirmacionPassword &&
                        touched.confirmacionPassword &&
                        errors.confirmacionPassword}
                    </span>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    Update Password
                  </button>
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

export default Login;
