import { CompeticionesRoutingModule } from './competiciones.routing';
import { CompeticionesComponent } from './competiciones.component';
import { ServicesModule } from './../../../services/services.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompeticionesListComponent } from './competiciones-list/competiciones-list.component';
import { CompeticionesFormComponent } from './competiciones-form/competiciones-form.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CompeticionesRoutingModule,
    ServicesModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
  ],
  declarations: [CompeticionesComponent,
    CompeticionesListComponent,
    CompeticionesFormComponent
  ]
})
export class CompeticionesModule { }

