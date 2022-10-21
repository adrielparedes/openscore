import { useRecoilValue } from "recoil";
import { userState } from "../../states/SecurityState";

const UserIndicator = () => {
  const user = useRecoilValue(userState);
  return (
    <li className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {user?.email}
      </a>
      <ul className="dropdown-menu dropdown-menu-dark"></ul>
    </li>
  );
};

export default UserIndicator;
