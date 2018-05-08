export const navigation = [
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-home'
  },
  {
    name: 'Reglamento',
    url: '/reglamento',
    icon: 'icon-list'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer'
  },
  {
    name: 'Noticias',
    url: '/noticias',
    icon: 'icon-book-open'
  },
  {
    name: 'Ranking',
    url: '/ranking',
    icon: 'icon-trophy '
  },
  {
    name: 'Pronosticos',
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
    name: 'Usuarios',
    url: '/admin/usuarios',
    icon: 'icon-people',
    role: 'ADMIN'
  },
  {
    name: 'Equipos',
    url: '/admin/equipos',
    icon: 'icon-flag',
    role: 'ADMIN'
  },
  {
    name: 'Partidos',
    url: '/admin/partidos',
    icon: 'icon-calendar',
    role: 'ADMIN'
  },
  {
    name: 'Noticias',
    url: '/admin/noticias',
    icon: 'icon-list',
    role: 'ADMIN'
  },
  // ACA ABAJO VA LA PARTE DE DESA PARA HACER PRUEBAS
  {
    title: true,
    name: 'Dev'
  },
  {
    name: 'Registro',
    url: '/pages/register',
    icon: 'icon-people'
  },
  {
    name: 'Login',
    url: '/pages/login',
    icon: 'icon-people'
  }
];
