import { Routes, RouterModule } from '@angular/router';
import { ReglamentoComponent } from './reglamento.component';

const routes: Routes = [
  {
    path: '',
    component: ReglamentoComponent,
    data: {
      title: 'Reglamento'
    }
  }
];

export const ReglamentoRoutes = RouterModule.forChild(routes);
