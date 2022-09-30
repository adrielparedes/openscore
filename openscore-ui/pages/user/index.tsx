import { AxiosError } from "axios";
import { Field, Formik } from "formik";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState, useRecoilValue } from "recoil";
import EmptyScreen from "../../components/molecules/EmptyScreen";
import LoadingScreen from "../../components/molecules/LoadingScreen";
import { layout } from "../../components/templates/MainLayout";
import { ApiResponse } from "../../model/ApiResponse";
import { Pais } from "../../model/Pais";
import UpdatePassword from "../../model/UpdatePassword";
import { UpdateUsuario } from "../../model/UpdateUsuario";
import { Usuario } from "../../model/Usuario";
import { PaisesService } from "../../services/PaisesService";
import { UsuarioService } from "../../services/UsuarioService";
import { tokenState, TOKEN_KEY, userState } from "../../states/SecurityState";
import { NextPageWithLayout } from "../_app";

const User: NextPageWithLayout = () => {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [countries, setCountries] = useState<Pais[]>([]);
  const [token, setToken] = useRecoilState(tokenState);
  const user = useRecoilValue(userState);
  const [usuario, setUsuario] = useState<Usuario>();
  const [item, setItem] = useState<UpdateUsuario>();

  const updateUsuario: UpdateUsuario = {
    nombre: "",
    apellido: "",
    pais: "",
  };

  const updatePassword: UpdatePassword = {
    oldPassword: "",
    password: "",
    confirmacionPassword: "",
  };

  useEffect(() => {
    const userService = new UsuarioService();

    if (user) {
      setBusy(true);
      userService
        .getMyUser()
        .then((res) => {
          const u = res.data.data;
          setUsuario(u);
          setItem({
            apellido: u.apellido,
            nombre: u.nombre,
            pais: u.pais.codigo,
          });
          setBusy(false);
        })
        .catch((err: AxiosError<ApiResponse<string>>) => {
          console.log(err);
          toast.error(err.response?.data?.description || "");
          setBusy(false);
        });
      const service = new PaisesService();
      service.getAll(0, 10).then((res) => {
        const paises = res.data.data;
        setCountries(paises);
      });
    }
  }, []);

  return (
    <LoadingScreen busy={busy}>
      <EmptyScreen isEmpty={!user}>
        <h1>User</h1>
        <div className="user">
          <section className="">
            <h3>General Information</h3>
            <div className="">
              <Formik
                initialValues={item || updateUsuario}
                validate={(values) => {
                  const errors = {};
                  return errors;
                }}
                onSubmit={(values, { setSubmitting, setFieldError }) => {
                  setSubmitting(true);

                  new UsuarioService()
                    .updateUser(usuario?.id || 0, values)
                    .then((res) => {
                      const token = res.data.data.token;
                      setToken(token);
                      setSubmitting(false);
                      toast.success("Successful Modification");
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
                          if (
                            fieldDescription.includes("confirmacionPassword")
                          ) {
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
                      <label>Email</label>
                      <input
                        className="form-control"
                        value={user?.email}
                        disabled
                      />
                    </div>
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
                    <button
                      type="submit"
                      className="btn btn-primary mb-1"
                      disabled={isSubmitting}
                    >
                      Update User Information
                    </button>
                  </form>
                )}
              </Formik>
            </div>
          </section>
          <section>
            <h3>Password</h3>
            <Formik
              initialValues={updatePassword}
              onSubmit={(values, { setSubmitting, setFieldError }) => {
                setSubmitting(true);
                new UsuarioService()
                  .updatePassword(values)
                  .then((res) => {
                    setToken("");
                    localStorage.removeItem(TOKEN_KEY);
                    setSubmitting(false);
                    toast.success("Password changed successfully");
                    router.push("/login");
                  })
                  .catch((err) => {
                    console.log(err);
                    const errors =
                      err.response?.data?.description?.split("\n") || [];
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
                isSubmitting,
                handleSubmit,
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-2">
                    <label htmlFor="nombre">Actual Password</label>
                    <Field
                      type="password"
                      name="oldPassword"
                      className="form-control"
                    />
                    <span className="login__error">
                      {errors.oldPassword &&
                        touched.oldPassword &&
                        errors.oldPassword}
                    </span>
                  </div>
                  <div className="form-group mb-2">
                    <label htmlFor="nombre">New Password</label>
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
                    <label htmlFor="nombre">Confirm New Password</label>
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
                    Update Password
                  </button>
                </form>
              )}
            </Formik>
          </section>
        </div>
      </EmptyScreen>
    </LoadingScreen>
  );
};

User.getLayout = layout;

export default User;
