import Router from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { rolesIncludedState } from "../states/SecurityState";

export function useWindowDimensions() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    // component is mounted and window is available
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);
    // unsubscribe from the event on component unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return { width, height };
}

export function useSecure(roles: string[], redirect: string) {
  const userRoles = useRecoilValue(rolesIncludedState);

  const rolesIncluded = (role: string) => {
    return userRoles.map((r) => r.toUpperCase()).includes(role.toUpperCase());
  };

  useEffect(() => {
    console.log(roles);
    console.log(userRoles);
    const found = roles.find((r) => rolesIncluded(r));
    if (!found) {
      Router.push(redirect);
    }
  }, []);
}
