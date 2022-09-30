import Link from "next/link";
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
      <ul className="dropdown-menu dropdown-menu-dark">
        <li>
          <Link href={"/user"}>
            <a className="dropdown-item" href="#">
              User Info
            </a>
          </Link>
          <Link href={"/logout"}>
            <a className="dropdown-item" href="#">
              Logout
            </a>
          </Link>
        </li>
      </ul>
    </li>
  );
};

export default UserIndicator;
