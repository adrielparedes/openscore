import { NoticiasComponent } from './noticias.component';
import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    component: NoticiasComponent,
    data: {
      title: 'News'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoticiasRoutingModule {}
