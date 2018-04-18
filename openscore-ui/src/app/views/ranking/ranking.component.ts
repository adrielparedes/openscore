import { RankingService } from './../../services/ranking.service';
import { Component, OnInit } from '@angular/core';
import { Ranking } from '../../model/ranking';
import { INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser';

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

  getCopa(ranking: Ranking) {
    console.log(ranking.ranking);
    if (ranking.ranking === 1) {
      return 'fas fa-trophy gold';
    } else if (ranking.ranking === 2) {
      return 'fas fa-trophy silver';
    } else if (ranking.ranking === 3) {
      return 'fas fa-trophy bronze';
    } else {
      return '';
    }
  }

}
