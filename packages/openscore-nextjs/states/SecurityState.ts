import jwtDecode, { JwtPayload } from "jwt-decode";
import { atom, RecoilValue, selector } from "recoil";
import { Usuario } from "../model/Usuario";

const isRoleIncluded = (token: string, role: string) => {
  try {
    const decoded = jwtDecode<JwtPayload & { roles: string[] }>(token);
    return decoded.roles.includes(role.toUpperCase());
  } catch (e) {
    return false;
  }
};

const isValid = (token: string) => {
  try {
    const decoded = jwtDecode<JwtPayload & { roles: string[] }>(token);
    return (decoded.exp || 0) > 0;
  } catch (e) {
    return false;
  }
};

export const TOKEN_KEY = "openscore-token";

export const tokenState = atom({
  key: "Token",
  default: "",
});

export const isLoggerInState = selector({
  key: "IsLoggedIn",
  get: ({ get }) => {
    const token = get(tokenState);

    return (
      token !== undefined &&
      token !== null &&
      token.length > 0 &&
      isValid(token)
    );

    return false;
  },
});

export const userState: RecoilValue<(JwtPayload & Usuario) | undefined> =
  selector({
    key: "user",
    get: ({ get }) => {
      const token = get(tokenState);
      try {
        const decoded = jwtDecode<JwtPayload & Usuario>(token);
        return decoded;
      } catch (e) {
        return undefined;
      }
    },
  });

export const isAdminState = selector({
  key: "isAdmin",
  get: ({ get }) => {
    const token = get(tokenState);
    return isRoleIncluded(token, "admin");
  },
});
