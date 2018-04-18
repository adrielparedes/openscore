import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
      },
      {
        path: 'noticias',
        loadChildren: './views/noticias/noticias.module#NoticiasModule'
      },
      {
        path: 'ranking',
        loadChildren: './views/ranking/ranking.module#RankingModule'
      },
      {
        path: 'pronosticos',
        loadChildren: './views/pronosticos/pronosticos.module#PronosticosModule'
      },
      {
        path: 'explorar',
        loadChildren: './views/explorar/explorar.module#ExplorarModule'
      },
      {
        path: 'admin/usuarios',
        loadChildren: './views/admin/usuarios/usuarios.module#UsuariosModule'
      },
      {
        path: 'admin/equipos',
        loadChildren: './views/admin/equipos/equipos.module#EquiposModule'
      },
      {
        path: 'admin/partidos',
        loadChildren: './views/admin/partidos/partidos.module#PartidosModule'
      }
    ]
  },
  {
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages'
    },
    children: [
      {
        path: '',
        loadChildren: './views/pages/pages.module#PagesModule',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
