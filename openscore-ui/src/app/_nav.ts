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
  {
    name: 'Competiciones',
    url: '/competiciones',
    icon: 'icon-trophy',
    children: [
      {
        name: 'Todas',
        url: '/competiciones',
        icon: 'icon-trophy'
      },
      {
        name: 'Copa Conmebol Libertadores',
        url: '/competiciones/1',
        icon: 'icon-trophy'
      }
    ]
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
