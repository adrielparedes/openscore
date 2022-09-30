import { useEffect, useState } from "react";
import { SetterOrUpdater } from "recoil";
import TeamFlag from "../../../components/atoms/TeamFlag";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import { layout } from "../../../components/templates/MainLayout";
import { PartidosService } from "../../../services/PartidosService";
import { NextPageWithLayout } from "../../_app";

import { Field, Form, Formik } from "formik";
import moment from "moment";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import CreateOrEditTitle from "../../../components/atoms/CreateOrEditTitle";
import { useSecure } from "../../../hooks/Hooks";

import { CrearPartido } from "../../../model/CrearPartido";

const format = "YYYY-MM-DD HH:mm";

const refresh = (
  service: PartidosService,
  setItem: SetterOrUpdater<CrearPartidoSimplified | undefined>,
  id: number | undefined,
  setBusy: SetterOrUpdater<boolean>,
  setEmpty: SetterOrUpdater<boolean>
) => {
  if (id !== undefined) {
    setBusy(true);
    service.get(id).then((res) => {
      const partido = res.data.data;
      setItem({
        local: partido.local.codigo,
        visitante: partido.visitante.codigo,
        dia: moment(new Date(partido.dia)).format(format),
        fase: partido.fase.codigo,
        fecha: partido.fecha,
        grupo: partido.grupo.codigo,
        lugar: partido.lugar,
      });

      setEmpty(res.data.data === undefined);
      setBusy(false);
    });
  }
};

interface CrearPartidoSimplified {
  local: string;
  visitante: string;
  dia: string;
  fecha: number;
  lugar: string;
  grupo: string;
  fase: string;
}

const CreateOrUpdate: NextPageWithLayout = () => {
  useSecure(["admin"], "/");

  var initialValues = {
    local: "",
    visitante: "",
    dia: "",
    fase: "",
    fecha: 0,
    grupo: "",
    lugar: "",
  };

  const router = useRouter();
  const { id } = router.query;
  const service = new PartidosService();
  const [item, setItem] = useState<CrearPartidoSimplified>();
  const [isEmpty, setEmpty] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  const ident = Number(id);

  useEffect(() => {
    if (ident > 0) {
      refresh(service, setItem, ident, setBusy, setEmpty);
    }
  }, [setItem, setEmpty]);

  return (
    <div className="match">
      <CreateOrEditTitle create={ident < 1}>Match</CreateOrEditTitle>
      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={isEmpty}>
          <Formik
            initialValues={item || initialValues}
            onSubmit={(values, actions) => {
              const date = moment(values.dia, format).utc();

              const partido: CrearPartido = {
                fase: values.fase,
                fecha: values.fecha,
                grupo: values.grupo,
                local: values.local,
                lugar: values.lugar,
                visitante: values.visitante,
                dia: date.unix(),
              };

              if (ident > 0) {
                service
                  .update(ident, partido)
                  .then((res) => router.push("/admin/matches"))
                  .catch((err) =>
                    toast.error(err.response?.data.description || "")
                  );
              } else {
                service
                  .add(partido)
                  .then((res) => router.push("/admin/matches"))
                  .catch((err) => {
                    toast.error(err.response?.data.description || "");
                  });
              }
              actions.setSubmitting(false);
            }}
          >
            {({ values }) => (
              <Form className="setresult__form">
                <div className="result__container">
                  <div className="row mb-1 align-items-center">
                    <div className="col-auto">
                      <label className="form-label">Local</label>
                    </div>
                    <div className="col-auto">
                      <Field className="form-control" name="local"></Field>
                    </div>
                    <div className="col-auto">
                      <TeamFlag src={values?.local}></TeamFlag>
                    </div>
                    <div className="col-auto">
                      <TeamFlag src={values?.visitante}></TeamFlag>
                    </div>

                    <div className="col-auto">
                      <Field className="form-control" name="visitante"></Field>
                    </div>
                    <div className="col-auto">
                      <label className="form-label">Visitante</label>
                    </div>
                  </div>
                  <div className="row mb-3">
                    <label className="form-label">Lugar</label>
                    <Field className="form-control" name="lugar"></Field>
                  </div>
                  <div className="row mb-3">
                    <label className="form-label">Fecha</label>
                    <Field className="form-control" name="fecha"></Field>
                  </div>
                  <div className="row mb-3">
                    <label className="form-label">Dia</label>
                    <Field
                      className="form-control"
                      type="datetime-local"
                      name="dia"
                    ></Field>
                  </div>
                  <div className="row mb-3">
                    <label className="form-label">Fase</label>
                    <Field className="form-control" name="fase"></Field>
                  </div>
                  <div className="row mb-3">
                    <label className="form-label">Grupo</label>
                    <Field className="form-control" name="grupo"></Field>
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => router.push("/admin/matches")}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </EmptyScreen>
      </LoadingScreen>
    </div>
  );
};

CreateOrUpdate.getLayout = layout;

export default CreateOrUpdate;
