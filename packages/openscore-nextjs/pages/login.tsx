import { Formik } from "formik";
import type { NextPage } from "next";
import Image from "next/image";
import messi from "../images/messi.webp";
import logo from "../images/logo-black.png";

const Login: NextPage = () => {
  return (
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
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
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
  );
};

export default Login;
