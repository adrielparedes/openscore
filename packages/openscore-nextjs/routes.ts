export interface Route {
  name: string;
  link: string;
  items?: Route[];
  roles?: string[];
}

const routes: Route[] = [
  { name: "Home", link: "/" },
  { name: "Leaderboard", link: "/leaderboard" },
  { name: "Standings", link: "/standings" },
  { name: "Forecast", link: "/forecast" },
  { name: "Rules", link: "/rules" },
  {
    name: "Admin",
    link: "/admin",
    roles: ["admin"],
    items: [
      { name: "Matches", link: "/admin/matches", roles: ["admin"] },
      { name: "Teams", link: "/admin/teams", roles: ["admin"] },
    ],
  },
];

export default routes;
