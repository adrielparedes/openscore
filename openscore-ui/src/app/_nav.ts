export const navigation = [
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home'
  },
  {
    name: 'Rules',
    url: '/reglamento',
    icon: 'icon-list'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },
  {
    name: 'News',
    url: '/noticias',
    icon: 'icon-book-open'
  },
  {
    name: 'Ranking',
    url: '/ranking',
    icon: 'icon-trophy '
  },
  {
    name: 'Predictions',
    url: '/pronosticos',
    icon: 'icon-compass'
  },
  // ACA ABAJO VA LA PARTE DE ADMIN
  {
    title: true,
    name: 'Admin',
    role: 'ADMIN'
  },
  {
    name: 'Users',
    url: '/admin/usuarios',
    icon: 'icon-people',
    role: 'ADMIN'
  },
  {
    name: 'Teams',
    url: '/admin/equipos',
    icon: 'icon-flag',
    role: 'ADMIN'
  },
  {
    name: 'Matches',
    url: '/admin/partidos',
    icon: 'icon-calendar',
    role: 'ADMIN'
  },
  {
    name: 'News',
    url: '/admin/noticias',
    icon: 'icon-list',
    role: 'ADMIN'
  },
  // ACA ABAJO VA LA PARTE DE DESA PARA HACER PRUEBAS
  {
    title: true,
    name: 'Dev',
    role: 'ADMIN'
  },
  {
    name: 'Register',
    url: '/pages/register',
    icon: 'icon-people',
    role: 'ADMIN'
  },
  {
    name: 'Login',
    url: '/pages/login',
    icon: 'icon-people',
    role: 'ADMIN'
  }
];
