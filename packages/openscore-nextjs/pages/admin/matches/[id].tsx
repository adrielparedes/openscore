import { useEffect, useState } from "react";
import { SetterOrUpdater } from "recoil";
import TeamFlag from "../../../components/atoms/TeamFlag";
import EmptyScreen from "../../../components/molecules/EmptyScreen";
import LoadingScreen from "../../../components/molecules/LoadingScreen";
import { layout } from "../../../components/templates/MainLayout";
import { Partido } from "../../../model/Partido";
import { Resultado } from "../../../model/Resultado";
import { PartidosService } from "../../../services/PartidosService";
import { NextPageWithLayout } from "../../_app";

import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import StatusIndicator from "../../../components/atoms/StatusIndicator";

const refresh = (
  service: PartidosService,
  setItem: SetterOrUpdater<Partido | undefined>,
  id: number,
  setBusy: SetterOrUpdater<boolean>,
  setEmpty: SetterOrUpdater<boolean>
) => {
  setBusy(true);
  service.get(id).then((res) => {
    console.log(res.data.data);
    setItem(res.data.data);
    setEmpty(res.data.data === undefined);
    setBusy(false);
  });
};

interface FormValues {
  finalizado: boolean;
  resultado: Resultado;
}

interface PenalesProps {
  item: Resultado | undefined;
  id: string;
}

const Penales = ({ item, id }: PenalesProps) => {
  if (item?.penales) {
    return (
      <div className="result__penales">
        (
        <Field id={id} name={id} className="form-control" type="number" />)
      </div>
    );
  } else {
    return <></>;
  }
};

const SetResult: NextPageWithLayout = () => {
  var initialValues: Resultado = {
    local: undefined,
    visitante: undefined,
    penales: false,
    penalesLocal: undefined,
    penalesVisitante: undefined,
  };

  const router = useRouter();
  const { id } = router.query;
  const service = new PartidosService();
  const [item, setItem] = useState<Partido>();
  const [isEmpty, setEmpty] = useState<boolean>(false);
  const [busy, setBusy] = useState<boolean>(false);

  useEffect(() => {
    refresh(service, setItem, id, setBusy, setEmpty);
  }, [setItem, setEmpty]);

  return (
    <div className="setresult">
      <h1>Set Result</h1>
      <LoadingScreen busy={busy}>
        <EmptyScreen isEmpty={isEmpty}>
          <Formik
            initialValues={item?.resultado || initialValues}
            onSubmit={(values, actions) => {
              service
                .resultado(id, values)
                .then((res) => router.push("/admin/matches"));
              actions.setSubmitting(false);
            }}
          >
            {(values) => (
              <Form className="setresult__form">
                <StatusIndicator>{item?.status}</StatusIndicator>
                <div>
                  <label className="form-label">Penales?</label>
                  <Field type="checkbox" id="penales" name="penales" />
                </div>
                <div className="result__container">
                  <div className="result__team">
                    <TeamFlag src={item?.local.codigo}></TeamFlag>
                    <label className="form-label">{item?.local.nombre}</label>
                  </div>
                  <div className="result__score">
                    <Field
                      id="local"
                      name="local"
                      className="form-control"
                      type="number"
                    />
                    <Penales id="penalesLocal" item={values.values}></Penales>
                    :
                    <Field
                      id="visitante"
                      name="visitante"
                      className="form-control"
                      type="number"
                    />
                    <Penales
                      id="penalesVisitante"
                      item={values.values}
                    ></Penales>
                  </div>
                  <div className="result__team">
                    <TeamFlag src={item?.visitante.codigo}></TeamFlag>
                    <label className="form-label">
                      {item?.visitante.nombre}
                    </label>
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

SetResult.getLayout = layout;

export default SetResult;
