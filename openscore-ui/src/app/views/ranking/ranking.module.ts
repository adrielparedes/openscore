import { RankingRoutingModule } from './ranking.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';

@NgModule({
  imports: [
    CommonModule,
    RankingRoutingModule
  ],
  declarations: [RankingComponent]
})
export class RankingModule { }