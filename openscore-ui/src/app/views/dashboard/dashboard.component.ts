import { RankingService } from './../../services/ranking.service';
import { PronosticoService } from './../../services/pronostico.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

  today: Date = new Date(Date.now());
  clock: string;
  finalClock: string;

  argentinos = 0;
  brasileros = 0;
  colombianos = 0;
  chileperu = 0;
  mexicanos = 0;

  arg = [];
  bra = [];
  col = [];
  cp = [];
  mex = [];

  comienzo = new Date(2018, 5, 14);
  final = new Date(2018, 6, 15);
  matches = 0;

  constructor(
    private pronosticoService: PronosticoService,
    private rankingService: RankingService) {

    this.clock = this.getRemainingDays();
    setInterval(() => {
      this.clock = this.getRemainingDays();
    }, 1000);
    this.finalClock = this.getRemainingDaysToFinal();
    setInterval(() => {
      this.finalClock = this.getRemainingDaysToFinal();
    }, 1000);
    this.getTodayMatches();

    this.getArgentineansRegistered();
    this.getBraziliansRegistered();
    this.getColombiansRegistered();
    this.getChileansPeruviansRegistered();
    this.getMexicansRegistered();

  }

  getRemainingDays() {
    const time = this.comienzo.getTime() - new Date().getTime();
    return (time / (1000 * 60 * 60 * 24)).toFixed();
  }

  getRemainingDaysToFinal() {
    const time = this.final.getTime() - new Date().getTime();
    return (time / (1000 * 60 * 60 * 24)).toFixed();
  }

  buildDate(fecha: Date) {
    return fecha.getFullYear().toString()
      + this.fillWithZeros((fecha.getMonth() + 1).toString())
      + this.fillWithZeros(fecha.getDate().toString());
  }

  getArgentineansRegistered() {
    this.rankingService.getAll('ARG', 0).subscribe(res => {
      this.argentinos = res.data.length
      this.arg = res.data.slice(0, 3);
    });
  }

  getBraziliansRegistered() {
    this.rankingService.getAll('BRA', 0).subscribe(res => {
      this.brasileros = res.data.length
      this.bra = res.data.slice(0, 3);
    });
  }

  getColombiansRegistered() {
    this.rankingService.getAll('COL', 0).subscribe(res => {
      this.colombianos = res.data.length
      this.col = res.data.slice(0, 3);
    });
  }
  getChileansPeruviansRegistered() {
    this.rankingService.getAll('CHI', 0).subscribe(ch => {
      this.rankingService.getAll('PER', 0).subscribe(p => {
        this.chileperu = ch.data.length + p.data.length;
        this.cp = ch.data.slice(0, 3);
        this.cp.push(p.data.slice(0, 3));
        console.log(this.cp[0]);
      });
    });
  }
  getMexicansRegistered() {
    this.rankingService.getAll('BRA', 0).subscribe(res => {
      this.mexicanos = res.data.length
      this.mex = res.data.slice(0, 3);
    });
  }

  fillWithZeros(date: string) {
    if (date.length === 1) {
      return '0' + date;
    } else {
      return date;
    }
  }

  getTodayMatches() {
    this.pronosticoService.getAll(0, 0, [{ key: 'dia', value: this.buildDate(this.today) }]).subscribe((res) => {
      this.matches = res.data.length;
    });
  }



}
