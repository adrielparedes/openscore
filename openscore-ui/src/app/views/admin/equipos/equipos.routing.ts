import { EquiposFormComponent } from './equipos-form/equipos-form.component';
import { EquiposListComponent } from './equipos-list/equipos-list.component';
import { EquiposComponent } from './equipos.component';
import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: EquiposComponent,
    data: {
      title: 'Equipos'
    },
    children: [
      {
        path: '',
        component: EquiposListComponent,
        data: {
          title: 'Listado de Equipos'
        }
      },
      {
        path: 'form',
        component: EquiposFormComponent ,
        data: {
          title: 'Nuevo Equipo'
        }
      },
      {
        path: 'form/:id',
        component: EquiposFormComponent,
        data: {
          title: 'Editar Equipo'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquiposRoutingModule { }
