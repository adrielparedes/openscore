import { PropsWithChildren } from "react";

const CreateOrEditTitle = ({
  create,
  children,
}: { create: boolean } & PropsWithChildren) => {
  if (create) {
    return <h1>Create {children}</h1>;
  } else {
    return <h1>Edit {children}</h1>;
  }
};

export default CreateOrEditTitle;
