import { RankingService } from './../../services/ranking.service';
import { Component, OnInit } from '@angular/core';
import { Ranking } from '../../model/ranking';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  ranking: Ranking[]

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.rankingService.getAll(0, 0).subscribe(
      res => {
        this.ranking = res.data;
      });
  }

}
