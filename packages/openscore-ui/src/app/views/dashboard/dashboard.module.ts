import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

// import { NgxTwitterTimelineModule } from 'ngx-twitter-timeline';


@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    // NgxTwitterTimelineModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
