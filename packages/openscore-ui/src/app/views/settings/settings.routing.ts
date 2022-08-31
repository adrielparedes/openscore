import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    data: {
      title: 'Settings'
    }
  }
];
export const SettingsRoutes = RouterModule.forChild(routes);
