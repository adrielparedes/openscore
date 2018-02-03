import { UsuariosRoutingModule } from './usuarios.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosComponent } from './usuarios.component';

@NgModule({
  imports: [
    CommonModule,
    UsuariosRoutingModule
  ],
  declarations: [UsuariosComponent]
})
export class UsuariosModule { }