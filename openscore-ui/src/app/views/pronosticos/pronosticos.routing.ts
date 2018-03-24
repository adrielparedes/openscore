import { PronosticosComponent } from './pronosticos.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PronosticosComponent,
    data: {
      title: 'Pronosticos'
    }
  },
];

export const PronosticosRoutes = RouterModule.forChild(routes);
