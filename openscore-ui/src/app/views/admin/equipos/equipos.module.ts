import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicesModule } from './../../../services/services.module';
import { EquiposRoutingModule } from './equipos.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquiposComponent } from './equipos.component';
import { EquiposListComponent } from './equipos-list/equipos-list.component';
import { EquiposFormComponent } from './equipos-form/equipos-form.component';

@NgModule({
  imports: [
    CommonModule,
    EquiposRoutingModule,
    ServicesModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    ModalModule.forRoot()
  ],
  declarations: [EquiposComponent,
    EquiposListComponent,
    EquiposFormComponent
  ]
})
export class EquiposModule { }