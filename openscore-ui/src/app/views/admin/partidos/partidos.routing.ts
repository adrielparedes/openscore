import { PartidosListComponent } from './partidos-list/partidos-list.component';
import { PartidosComponent } from './partidos.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PartidosComponent,
    data: {
      title: 'Partidos'
    },
    children: [
      {
        path: '',
        component: PartidosListComponent,
        data: {
          title: 'Listado de Partidos'
        }
      },
    ]
  },
];

export const PartidosRoutes = RouterModule.forChild(routes);
