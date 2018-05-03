import { ServicesModule } from './../../services/services.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from './noticias.component';
import { NoticiasRoutingModule } from './noticias-routing.module';
import { NoticiaComponent } from './noticia/noticia.component';

@NgModule({
  imports: [
    CommonModule,
    NoticiasRoutingModule,
    ServicesModule
  ],
  declarations: [NoticiasComponent,
    NoticiaComponent
]
})
export class NoticiasModule { }