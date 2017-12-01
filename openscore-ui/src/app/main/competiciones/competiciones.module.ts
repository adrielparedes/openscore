import { CompeticionesService } from './../../services/competiciones.service';
import { CommonsModule } from './../../commons/commons.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompeticionesComponent } from './competiciones.component';
import { CompeticionListComponent } from './competicion-list/competicion-list.component';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule
  ],
  providers: [CompeticionesService],
  exports: [CompeticionesComponent],
  declarations: [CompeticionesComponent,
    CompeticionListComponent
  ]
})
export class CompeticionesModule { }
