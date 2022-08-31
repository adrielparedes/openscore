import { ReglamentoRoutes } from './reglamento.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReglamentoComponent } from './reglamento.component';

@NgModule({
  imports: [
    CommonModule,
    ReglamentoRoutes
  ],
  declarations: [ReglamentoComponent]
})
export class ReglamentoModule { }
