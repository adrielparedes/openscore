import { MainModule } from './main/main.module';
import { MainComponent } from './main/main.component';
import { CompeticionesModule } from './main/competiciones/competiciones.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AllComponent } from './all/all.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AllComponent
  ],
  imports: [
    BrowserModule,
    CompeticionesModule,
    MainModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
