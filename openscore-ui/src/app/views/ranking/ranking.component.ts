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
  unfilteredRanking: Ranking[]
  filter: String = '';
  loading = true;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.update();
  }

  update() {
    this.loading = true;
    this.rankingService.getAll(0, 0).subscribe(
      res => {
        this.unfilteredRanking = res.data;
        this.ranking = this.unfilteredRanking;
        this.filter = '';
        this.loading = false;
      });
  }

  onChange(event) {
    console.log(event);
    this.filter = event;
    if (event === '') {
      this.ranking = this.unfilteredRanking;
    } else {
      this.ranking = this.unfilteredRanking.filter(rank => {
        const found = this.find(event, rank.nombre) || this.find(event, rank.pais);
        return found;
      });
    }
  }


  find(search: string, attr: string) {
    return attr.toLowerCase().indexOf(search.toLowerCase()) >= 0
  }

  getCopa(ranking: Ranking) {
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
