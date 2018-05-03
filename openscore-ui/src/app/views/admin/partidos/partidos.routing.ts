import { PartidoFormComponent } from './partido-form/partido-form.component';
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
      {
        path: 'form',
        component: PartidoFormComponent,
        data: {
          title: 'Crear Partido'
        }
      },
      {
        path: 'form/:id',
        component: PartidoFormComponent,
        data: {
          title: 'Editar Partido'
        }
      }
    ]
  },
];

export const PartidosRoutes = RouterModule.forChild(routes);
