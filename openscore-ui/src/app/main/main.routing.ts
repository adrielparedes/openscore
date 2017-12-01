import { NoticiasComponent } from './noticias/noticias.component';
import { MainComponent } from './main.component';
import { RankingComponent } from './ranking/ranking.component';
import { CompeticionesComponent } from './competiciones/competiciones.component';
import { HomeComponent } from './../home/home.component';
import { Routes, RouterModule } from '@angular/router';

export const MainRoutes = [
  { name: 'Noticias', path: 'noticias', component: NoticiasComponent },
  { name: 'Explorar', path: 'explorar', component: CompeticionesComponent },
  { name: 'Competiciones', path: 'competiciones', component: CompeticionesComponent },
  { name: 'Ranking', path: 'ranking', component: RankingComponent },
  { path: '**', redirectTo: '/noticias', pathMatch: 'full' },
];
