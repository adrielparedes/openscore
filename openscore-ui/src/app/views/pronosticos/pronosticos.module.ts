import { NgxSpinnerModule } from 'ngx-spinner';
import { ServicesModule } from './../../services/services.module';
import { PronosticosRoutes } from './pronosticos.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PronosticosComponent } from './pronosticos.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PronosticoComponent } from './pronostico/pronostico.component';

@NgModule({
  imports: [
    CommonModule,
    PronosticosRoutes,
    ServicesModule,
    TabsModule,
    NgxSpinnerModule
  ],
  declarations: [PronosticosComponent,
    PronosticoComponent
]
})
export class PronosticosModule { }