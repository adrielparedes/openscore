import { HomeRoutes } from './home.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutes,
    NgxTwitterTimelineModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
