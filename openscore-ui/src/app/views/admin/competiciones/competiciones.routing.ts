import { CompeticionesFormComponent } from './competiciones-form/competiciones-form.component';
import { CompeticionesListComponent } from './competiciones-list/competiciones-list.component';
import { CompeticionesComponent } from './competiciones.component';
import { NgModule } from '@angular/core';
import {
  Routes,
  RouterModule
} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    component: CompeticionesComponent,
    data: {
      title: 'Competiciones'
    },
    children: [
      {
        path: '',
        component: CompeticionesListComponent,
        data: {
          title: 'Listado de Competiciones'
        }
      },
      {
        path: 'form',
        component: CompeticionesFormComponent,
        data: {
          title: 'Nueva Competicion'
        }
      },
      {
        path: 'form/:id',
        component: CompeticionesFormComponent,
        data: {
          title: 'Editar Competicion'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompeticionesRoutingModule { }
