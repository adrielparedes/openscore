import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExplorarComponent } from './explorar.component';
import { ExplorarRoutingModule } from './explorar.routing';

@NgModule({
  imports: [
    CommonModule,
    ExplorarRoutingModule
  ],
  declarations: [ExplorarComponent]
})
export class ExplorarModule { }