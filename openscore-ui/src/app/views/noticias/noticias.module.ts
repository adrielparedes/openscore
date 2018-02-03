import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from './noticias.component';
import { NoticiasRoutingModule } from './noticias-routing.module';

@NgModule({
  imports: [
    CommonModule,
    NoticiasRoutingModule
  ],
  declarations: [NoticiasComponent]
})
export class NoticiasModule { }