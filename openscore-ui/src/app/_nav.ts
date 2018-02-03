export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    badge: {
      variant: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Noticias',
    url: '/noticias',
    icon: 'icon-book-open',
    badge: {
      variant: 'warning',
      text: '1'
    }
  },
  {
    name: 'Ranking',
    url: '/ranking',
    icon: 'icon-trophy '
  },
  {
    name: 'Explorar',
    url: '/explorar',
    icon: 'icon-compass'
  },
  // ACA ABAJO VA LA PARTE DE AMIN
  {
    title: true,
    name: 'Admin'
  },
  {
    name: 'Usuarios',
    url: '/admin/usuarios',
    icon: 'icon-people'
  },
];
