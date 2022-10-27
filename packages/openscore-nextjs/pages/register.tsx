import { Field, Formik } from "formik";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import LoadingScreen from "../components/molecules/LoadingScreen";
import messi from "../images/img-hincha-rh.png";
import { CrearUsuario } from "../model/CrearUsuario";
import { Pais } from "../model/Pais";
import { PaisesService } from "../services/PaisesService";
import { UsuarioService } from "../services/UsuarioService";
import { isLoggerInState, tokenState } from "../states/SecurityState";

const Login: NextPage = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [countries, setCountries] = useState<Pais[]>([]);
  const [token, setToken] = useRecoilState(tokenState);
  const isLoggedIn = useRecoilValue(isLoggerInState);

  const crearUsuario: CrearUsuario = {
    nombre: "",
    apellido: "",
    pais: "",
    email: "",
    confirmacionEmail: "",
    password: "",
    confirmacionPassword: "",
  };

  useEffect(() => {
    const service = new PaisesService();
    service.getAll(0, 10).then((res) => {
      const paises = res.data.data;
      console.log(paises);
      setCountries(paises);
    });
  }, []);

  return (
    <LoadingScreen busy={busy}>
      <div className="login">
        <div className="login__left">
          <div className="login__header">
            <img src="/rhopenscore2022-logo.png" alt="openscore-logo"></img>
          </div>
          <div className="login__form">
            <h3>Welcome to OpenScore!</h3>
            <Formik
              initialValues={crearUsuario}
              validate={(values) => {
                const errors = {};
                return errors;
              }}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                setSubmitting(true);

                new UsuarioService()
                  .registrar(values)
                  .then((res) => {
                    const token = res.data.data.token;
                    router.push("/login");
                    setSubmitting(false);
                    toast.success("Successful Registration");
                  })
                  .catch((err) => {
                    console.log(err);
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
                    <label htmlFor="nombre">Name</label>
                    <Field
                      type="nombre"
                      name="nombre"
                      className="form-control"
                    />
                    <span className="login__error">
                      {errors.nombre && touched.nombre && errors.nombre}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="apellido">Surname</label>
                    <Field
                      type="apellido"
                      name="apellido"
                      className="form-control"
                    />
                    <span className="login__error">
                      {errors.apellido && touched.apellido && errors.apellido}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="pais">Country</label>
                    {/* <Field type="pais" name="pais" className="form-control" /> */}
                    <select
                      name="pais"
                      value={values.pais}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="form-control"
                      style={{ display: "block" }}
                    >
                      <option value="" label="Select Country">
                        Select Country
                      </option>
                      {countries.map((c) => (
                        <option
                          key={c.codigo}
                          value={c.codigo}
                          label={c.nombre}
                        >
                          {c.nombre}
                        </option>
                      ))}
                    </select>
                    <span className="login__error">
                      {errors.pais && touched.pais && errors.pais}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="email">Email</label>
                    <Field type="email" name="email" className="form-control" />
                    <span className="login__error">
                      {errors.email && touched.email && errors.email}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="confirmacionEmail">
                      Email Confirmation
                    </label>
                    <Field
                      type="confirmacionEmail"
                      name="confirmacionEmail"
                      className="form-control"
                    />
                    <span className="login__error">
                      {errors.confirmacionEmail &&
                        touched.confirmacionEmail &&
                        errors.confirmacionEmail}
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
                    <label htmlFor="confirmacionPassword">
                      Password Confirmation
                    </label>
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
                    className="btn btn-primary mb-1"
                    disabled={isSubmitting}
                  >
                    Register
                  </button>
                  <p className="text-center">
                    Already registered?{" "}
                    <Link href={"/login"}>
                      <a>Login</a>
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
