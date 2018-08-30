import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from './../../../services/services.module';
import { PartidosRoutes } from './partidos.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidosComponent } from './partidos.component';
import { PartidosListComponent } from './partidos-list/partidos-list.component';
import { ResultadoComponent } from './resultado/resultado.component';
import { PartidoFormComponent } from './partido-form/partido-form.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    PartidosRoutes,
    ServicesModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [PartidosComponent,
    PartidosListComponent,
    ResultadoComponent,
    PartidoFormComponent
  ],
  entryComponents: [ResultadoComponent]
})
export class PartidosModule { }
