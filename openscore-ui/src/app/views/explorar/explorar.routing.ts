import { ExplorarComponent } from './explorar.component';
import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    component: ExplorarComponent,
    data: {
      title: 'Explorar'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExplorarRoutingModule {}
