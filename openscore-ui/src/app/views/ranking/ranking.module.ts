import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RankingRoutingModule } from './ranking.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';
import { ServicesModule } from '../../services/services.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ServicesModule,
    FormsModule,
    RankingRoutingModule,
    MatProgressSpinnerModule
  ],
  declarations: [RankingComponent]
})
export class RankingModule { }