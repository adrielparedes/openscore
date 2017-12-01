import { NoticiasModule } from './noticias/noticias.module';
import { NoticiasComponent } from './noticias/noticias.component';
import { RankingModule } from './ranking/ranking.module';
import { MainRoutes } from './main.routing';
import { RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';

@NgModule({
  imports: [
    CommonModule,
    RankingModule,
    NoticiasModule,
    RouterModule.forRoot(MainRoutes)
  ],
  exports: [MainComponent],
  declarations: [
    MainComponent,
    MenuComponent,
  ]
})
export class MainModule { }
