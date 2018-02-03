import { RankingComponent } from './ranking.component';
import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    component: RankingComponent,
    data: {
      title: 'Ranking'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RankingRoutingModule {}
