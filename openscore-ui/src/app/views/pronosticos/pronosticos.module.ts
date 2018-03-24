import { PronosticosRoutes } from './pronosticos.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PronosticosComponent } from './pronosticos.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  imports: [
    CommonModule,
    PronosticosRoutes,
    TabsModule
  ],
  declarations: [PronosticosComponent]
})
export class PronosticosModule { }