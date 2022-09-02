export interface Route {
  name: string;
  link: string;
  items?: Route[];
}

const routes: Route[] = [
  { name: "Home", link: "/" },
  { name: "Forecast", link: "/forecast" },
  {
    name: "Admin",
    link: "/admin",
    items: [{ name: "Matches", link: "/admin/matches" }],
  },
];

export default routes;
