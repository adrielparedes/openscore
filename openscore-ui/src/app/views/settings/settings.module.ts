import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutes } from './settings.routing';
import { ServicesModule } from '../../services/services.module';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutes,
    FormsModule,
    ReactiveFormsModule,
    ServicesModule
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
