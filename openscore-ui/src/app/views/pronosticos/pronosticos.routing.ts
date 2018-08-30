import { PronosticosComponent } from './pronosticos.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PronosticosComponent,
    data: {
      title: 'Predictions'
    }
  },
];

export const PronosticosRoutes = RouterModule.forChild(routes);
