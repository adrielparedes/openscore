import { RankingRoutingModule } from './ranking.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { ServicesModule } from '../../services/services.module';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule,
    RankingRoutingModule
  ],
  declarations: [RankingComponent]
})
export class RankingModule { }