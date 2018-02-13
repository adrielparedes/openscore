import { ServicesModule } from './../../../services/services.module';
import { UsuariosRoutingModule } from './usuarios.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';

@NgModule({
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    ServicesModule
  ],
  declarations: [UsuariosComponent]
})
export class UsuariosModule { }