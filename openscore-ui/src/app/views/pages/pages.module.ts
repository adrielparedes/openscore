import { CommonModule } from '@angular/common';
import { ServicesModule } from './../../services/services.module';
import { NgModule } from '@angular/core';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

import { PagesRoutingModule } from './pages-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PasswordComponent } from './password/password.component';
import { RecoverComponent } from './recover/recover.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ServicesModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent,
    RegisterComponent,
    PasswordComponent,
    RecoverComponent
]
})
export class PagesModule { }
