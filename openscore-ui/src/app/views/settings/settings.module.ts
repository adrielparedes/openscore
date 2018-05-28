import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutes } from './settings.routing';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutes
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
