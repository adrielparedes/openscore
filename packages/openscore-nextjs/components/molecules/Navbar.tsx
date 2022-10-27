import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import logo from "../../images/rhopenscore2022-logo-reverse.png";
import routes, { Route } from "../../routes";
import { isAdminState } from "../../states/SecurityState";
import UserIndicator from "../atoms/UserIndicator";

const NavItem = ({ route }: { route: Route }) => {
  const router = useRouter();
  return (
    <li className="nav-item">
      <Link href={route.link}>
        <a
          className={
            router.pathname === route.link ? "nav-link active" : "nav-link"
          }
          aria-current="page"
          href="#"
        >
          {route.name}
        </a>
      </Link>
    </li>
  );
};

const NavDropdown = ({ route }: { route: Route }) => (
  <li className="nav-item dropdown">
    <a
      className="nav-link dropdown-toggle"
      href="#"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {route.name}
    </a>
    <ul className="dropdown-menu dropdown-menu-dark">
      {route.items?.map((item) => (
        <NavDropdownItem key={item.name} route={item}></NavDropdownItem>
      ))}
    </ul>
  </li>
);

const NavDropdownItem = ({ route }: { route: Route }) => (
  <li>
    <Link href={route.link}>
      <a className="dropdown-item" href="#">
        {route.name}
      </a>
    </Link>
  </li>
);

const NavRoute = ({ route }: { route: Route }) => {
  if (route.items) {
    return <NavDropdown key={route.name} route={route}></NavDropdown>;
  } else {
    return <NavItem key={route.name} route={route}></NavItem>;
  }
};

const Nav = ({ routes }: { routes: Route[] }) => {
  const isAdmin = useRecoilValue(isAdminState);

  var filteredRoutes = routes;

  if (!isAdmin) {
    filteredRoutes = routes.filter((r) => !r.roles?.includes("admin"));
  }

  return (
    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
      {filteredRoutes.map((r) => (
        <NavRoute key={r.name} route={r}></NavRoute>
      ))}
    </ul>
  );
};

const Navbar = () => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
    <div className="container">
      <a className="navbar-brand" href="#">
        <Image
          src={logo}
          alt="Logo"
          width="170"
          height="50"
          className="d-inline-block mt-1"
        ></Image>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <Nav routes={routes}></Nav>
        <ul className="navbar-nav mb-2 mb-lg-0">
          <UserIndicator></UserIndicator>
        </ul>
      </div>
    </div>
  </nav>
);

export default Navbar;
