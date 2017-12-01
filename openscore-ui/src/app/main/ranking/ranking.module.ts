import { CommonsModule } from './../../commons/commons.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankingComponent } from './ranking.component';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule
  ],
  exports: [RankingComponent],
  declarations: [RankingComponent]
})
export class RankingModule { }
