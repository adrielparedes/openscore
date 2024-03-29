import Image from "next/image";
import { PropsWithChildren } from "react";
import soccer from "./soccer.svg";

export interface EmptyScreenProps extends PropsWithChildren {
  title?: string;
  description?: string;
  isEmpty: boolean;
}

const getDefaultTitle = (title?: string) =>
  title ? title : "Wow, so much emptiness...";
const getDefaultDescription = (description?: string) =>
  description
    ? description
    : "Don't worry we will check if VAR is working correctly";

const EmptyScreen = ({
  title,
  description,
  isEmpty,
  children,
}: EmptyScreenProps) =>
  isEmpty ? (
    <div className="empty-screen">
      <h1 className="empty-screen__title">{getDefaultTitle(title)}</h1>
      <h4 className="fw-light mb-4">{getDefaultDescription(description)}</h4>
      <Image src={soccer} width={500} height={400}></Image>
    </div>
  ) : (
    <>{children}</>
  );

export default EmptyScreen;
