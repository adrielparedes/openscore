import { useEffect, useState } from "react";
import { SetterOrUpdater } from "recoil";
import TeamFlag from "../../../components/atoms/TeamFlag";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import { layout } from "../../../components/templates/MainLayout";
import { PartidosService } from "../../../services/PartidosService";
import { NextPageWithLayout } from "../../_app";

import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import CreateOrEditTitle from "../../../components/atoms/CreateOrEditTitle";
import { CrearPartido } from "../../../model/CrearPartido";
import { useSecure } from "../../../hooks/Hooks";

const refresh = (
  service: PartidosService,
  setItem: SetterOrUpdater<CrearPartido | undefined>,
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
        dia: new Date(partido.dia),
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

const CreateOrUpdate: NextPageWithLayout = () => {
  useSecure(["admin"], "/");

  var initialValues: CrearPartido = {
    local: "",
    visitante: "",
    dia: new Date(),
    fase: "",
    fecha: 0,
    grupo: "",
    lugar: "",
  };

  const router = useRouter();
  const { id } = router.query;
  const service = new PartidosService();
  const [item, setItem] = useState<CrearPartido>();
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
              if (ident > 0) {
                service
                  .update(ident, values)
                  .then((res) => router.push("/admin/matches"));
              } else {
                service
                  .add(values)
                  .then((res) => router.push("/admin/matches"));
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
                    <Field className="form-control" name="dia"></Field>
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
