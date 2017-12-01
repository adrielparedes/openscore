import { CommonsModule } from './../../commons/commons.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoticiasComponent } from './noticias.component';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule
  ],
  exports: [NoticiasComponent],
  declarations: [NoticiasComponent]
})
export class NoticiasModule { }
