import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from './../../../services/services.module';
import { PartidosRoutes } from './partidos.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidosComponent } from './partidos.component';
import { PartidosListComponent } from './partidos-list/partidos-list.component';

@NgModule({
  imports: [
    CommonModule,
    PartidosRoutes,
    ServicesModule,
    ReactiveFormsModule,
    ModalModule.forRoot()
  ],
  declarations: [PartidosComponent,
    PartidosListComponent
]
})
export class PartidosModule { }